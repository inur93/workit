import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import SnackbarContent from "@material-ui/core/SnackbarContent/SnackbarContent";
import Icon from "@material-ui/core/Icon/Icon";
import IconButton from "@material-ui/core/IconButton/IconButton";
import {amber, green} from "@material-ui/core/colors";
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import ToastStore from "../../stores/ToastStore";

const styles = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

export const info = (msg, options) => ToastStore.info(msg, options);
export const error = (msg, options) => ToastStore.error(msg, options);
export const warning = (msg, options) => ToastStore.warning(msg, options);
export const success = (msg, options) => ToastStore.success(msg, options);

class Toast extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        const {message, variant, onClose, options, show} = ToastStore;

        const {classes, className, ...other} = this.props;
        const Icon = variantIcon[variant];
        return (
            <Snackbar open={show}
                      anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                      }}
                      autoHideDuration={3000}
                      onClose={onClose}>
                <SnackbarContent
                    className={classNames(classes[variant], className)}
                    aria-describedby="client-snackbar"
                    message={<span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)}/>
                        {message}
        </span>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={onClose}
                        >
                            <CloseIcon className={classes.icon}/>
                        </IconButton>,
                    ]}
                    {...other}
                />
            </Snackbar>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(Toast));

decorate(Toast, {});

Toast.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string
}

Toast.defaultProps = {};