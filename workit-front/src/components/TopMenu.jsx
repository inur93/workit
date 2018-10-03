import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from "mobx-react";
import {Link, withRouter} from "react-router-dom";
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import {computed, decorate, observable} from "mobx";
import Editable, {D} from "./cms/Editable";
import UserStore from "../stores/UserStore";
import AuthStore from "../stores/AuthStore";
import TokenStore from "../stores/TokenStore";
import {Links} from "../config/Links";

const drawerWidth = 340;
const styles = theme => ({
    toolbar: {
        backgroundColor: theme.palette.primary.main,
        /*paddingLeft: '0px'*/
    },
    toolbarTitle: {
        flex: 1,
        marginLeft: 20,
        color: "#FFF"
    },
    appFrame: {
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },

});

class TopMenu extends Component {

    anchorEl = null;



    constructor(props) {
        super(props);
    }

    get authorized() {
        return !!this.props.tokenStore.token;
    };

    handleLogout = () => {
        this.props.tokenStore.logout();
        this.handleClose();
    };

    handleMenu = event => {
        this.anchorEl = event.currentTarget;
    };

    handleClose = () => {
        this.anchorEl = null;
    };

    render() {

        const {classes, userStore} = this.props;
        const {anchorEl, authorized} = this;
        const open = Boolean(anchorEl);
        const {email} = userStore.self || {};
        return (

            <AppBar className={classes.appBar} position="absolute">
                <Toolbar  className={classes.toolbar}>

                    <Typography variant="title" className={classes.toolbarTitle}>
                        <Editable field={"page-title"} />
                    </Typography>
                    {authorized && (
                        <div>
                            {email}
                            <IconButton
                                aria-owns={open ? 'menu-appbar' : null}
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                color="inherit"
                            >
                                <AccountCircle/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={this.handleClose} component={Link} to={Links.profile()}>
                                    {D("Profile")}
                                </MenuItem>
                                <MenuItem onClick={this.handleLogout}>
                                    {D("Log out")}
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>

            </AppBar>
        )
    }
}

export default withRouter(withStyles(styles, {withTheme: true})(inject("userStore", "authStore", "tokenStore")(observer(TopMenu))));
TopMenu.propTypes = {
    userStore: PropTypes.instanceOf(UserStore),
    authStore: PropTypes.instanceOf(AuthStore),
    tokenStore: PropTypes.object.isRequired
};

TopMenu.defaultProps = {};

decorate(TopMenu, {
    authorized: computed,
    anchorEl: observable
});