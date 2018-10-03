import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography/Typography";
import Editable, {D} from "../cms/Editable";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Grid from "@material-ui/core/Grid/Grid";
import Divider from "@material-ui/core/Divider/Divider";
import {Link, Route, withRouter} from "react-router-dom";
import {Links} from "../../config/Links";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import HomeIcon from "@material-ui/core/SvgIcon/SvgIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItem from "@material-ui/core/ListItem/ListItem";
import Perm from "../management/Perm";
import {Policies} from "../../config/Policies";
import Collapse from "@material-ui/core/Collapse/Collapse";

const styles = theme => ({
        row: {
            marginTop: 5,
            marginBottom: 5
        },
        rowHeader: {
            fontSize: '1em'
        },
        rowContent: {
            fontSize: '1em'
        }
    }
);

export const Title = ({children, isStatic}) => {
    return <Typography variant={"headline"}>{isStatic ? children : <Editable field={children}/>}</Typography>
};

export const CustomInputLabel = (props) => {
    return <InputLabel {...props}><Editable field={props.children}/></InputLabel>
};

export const HeaderColumn = withStyles(styles, {withTheme: true})(({children, classes}) => {
    return <Grid item xs={3} md={2}>
        <Typography className={classes.rowHeader} variant={"body2"}>
            {children}
        </Typography>
    </Grid>
});

export const ContentColumn = withStyles(styles, {withTheme: true})(({children, classes}) => {
    return <Grid item xs={9} md={10}>
        <Typography className={classes.rowContent}>
            {children}
        </Typography>
    </Grid>
});

export const FieldRow = withStyles(styles, {withTheme: true})(({title, content, classes}) => {
    return <Grid item>
        <Grid container className={classes.row}>
            <HeaderColumn>{D(title)}</HeaderColumn>
            <ContentColumn>{content}</ContentColumn>
        </Grid>
        <Divider/>
    </Grid>
});

export const FieldRowUser = withStyles(styles, {withTheme: true})(({title, user, emptyText = "", classes}) => {
    return <Grid item>
        <Grid container className={classes.row}>
            <HeaderColumn>{D(title)}</HeaderColumn>
            <ContentColumn>{user ? `${user.name || 'no name'} (${user.email})` : D(emptyText)}</ContentColumn>
        </Grid>
        <Divider/>
    </Grid>
});

export const SidebarNavGroup = ({children, path}) => {
    return <Route path={path} children={(props) => {
        return <Collapse in={!!props.match} timeout={1000}>
            {children(props.match, props.location.pathname)}
        </Collapse>
    }
    }/>
};
export const SidebarNavItemStatic = ({label, to, exact = false, icon, policy}) => {
    const listItem = <Route path={to()} exact={exact} children={({match}) =>
        <ListItem button component={Link} to={to()} selected={!!match}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={<Editable field={label}/>}/>
        </ListItem>}
    />;
    if (policy) {
        return <Perm permissions={policy}>
            {listItem}
        </Perm>
    } else {
        return listItem;
    }
};
export const SidebarNavItem = ({to, path, label, icon, policy, exact, match, classes, param}) => {
    const link = param ? to(match && match.params[param]) : to();
    const selected = exact ? link === path : path.startsWith(link);
    const listItem =
        <ListItem button component={Link} to={link} selected={selected}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={<Editable field={label}/>}/>
        </ListItem>;
    if (policy) {
        return <Perm permissions={policy}>
            {listItem}
        </Perm>
    } else {
        return listItem;
    }
};
/*export const SidebarNavItem = withStyles(styles, {withTheme: true})(({to, label, icon, policy, exact, classes}) => {
    const listItem =
        <Route path={to} exact={exact} children={({match}) =>
            <Collapse in={true}>
                <ListItem button component={Link} to={to} selected={!!match}>
                    <ListItemIcon>
                        {icon}
                    </ListItemIcon>
                    <ListItemText primary={<Editable field={label}/>}/>
                </ListItem>
            </Collapse>}
        />;
    if (policy) {
        return <Perm permissions={policy}>
            {listItem}
        </Perm>
    } else {
        return listItem;
    }
});*/

export const SidebarNavItemRoute = ({to, path, param, label, icon, policy, exact}) => {
    return <Route path={path ? path() : to()}
                  render={({match, location}) =>
                      <Collapse in={true}>
                          <SidebarNavItem label={label}
                                          path={location.pathname}
                                          exact={exact}
                                          to={to(match.params[param])}
                                          icon={icon}
                                          policy={policy(match.params[param])}/>
                      </Collapse>}
    />
}


