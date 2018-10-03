import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";

import AuthStore from "../stores/AuthStore";

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Collapse from '@material-ui/core/Collapse';
import {action, decorate, observable} from "mobx";
import {withRouter} from "react-router-dom";
import queryString from "query-string";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import {Links} from "../config/Links";
import {D} from "./cms/Editable";
import * as Toast from "./shared/Toast";

const styles = theme => ({})

class Login extends Component {

    loading = false;

    resetPassword = false;
    username = "";
    password = "";
    email = "";

    error = {
        username: false,
        password: false,
        email: false
    };

    handleLogin = async (e) => {
        e.preventDefault();
        this.loading = true;
        const {username, password} = this;
        this.props.authStore.login({username, password})
            .then(() => {
                const values = queryString.parse(this.props.location.search);
                this.props.history.push(values.returnUrl || Links.home());
            })
            .catch(err => {
                Toast.error(err.message);
            })
            .finally(() => this.isLoading = false);
    };


    toggleResetPassword = () => {
        this.resetPassword = !this.resetPassword;
    }
    handleResetPassword = () => {
    }

    handleFieldChange = (event, field) => {
        const value = event.target.value;
        this[field] = value;
        this.error[field] = !value;
    }

    render() {
        const {onClose, theme} = this.props;
        return (<MuiThemeProvider theme={theme}>

            <Dialog
                open={true}
                onClose={onClose}
                aria-labelledby="form-dialog-title"
            >
                <form onSubmit={this.resetPassword ? this.handleResetPassword : this.handleLogin}>
                    <DialogTitle id="form-dialog-title">{D(this.resetPassword ? "Reset password" : "Login")}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {D(this.resetPassword ? "Enter your email address and an email will be sent with the new password" : "Enter your username and password")}
                        </DialogContentText>
                        <Collapse in={!this.resetPassword}>
                            <TextField
                                error={this.error.username}
                                onChange={(e) => this.handleFieldChange(e, "username")}
                                autoFocus
                                margin="dense"
                                id="username"
                                label={D("Username")}
                                fullWidth
                            />
                        </Collapse>
                        <Collapse in={!this.resetPassword}>
                            <TextField
                                error={this.error.password}
                                onChange={(e) => this.handleFieldChange(e, "password")}
                                margin="dense"
                                id="password"
                                label={D("Password")}
                                type="password"
                                fullWidth
                            />
                        </Collapse>
                        <Collapse in={this.resetPassword}>

                            <TextField
                                error={this.error.email}
                                required={this.resetPassword}
                                onChange={(e) => this.handleFieldChange(e, "email")}
                                autoFocus
                                id="email"
                                label={D("Email")}
                                type="email"
                                fullWidth
                            />

                        </Collapse>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.toggleResetPassword}>
                            {D(this.resetPassword ? "Login" : "Reset password")}
                        </Button>
                        <Button disabled={this.loading}
                                variant="raised"
                                type="submit"
                                color="primary">
                            {D(this.resetPassword ? "Reset password" : "Login")}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

        </MuiThemeProvider>);
    }
}

export default withRouter(withStyles(styles, {withTheme: true})(observer(Login)));
Login.propTypes = {
    authStore: PropTypes.instanceOf(AuthStore),
    theme: PropTypes.object
}

decorate(Login, {
    resetPassword: observable,
    username: observable,
    password: observable,
    email: observable,
    error: observable,
    loading: observable,
    handleFieldChange: action
})
