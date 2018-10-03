import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import TextField from "@material-ui/core/TextField/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import CustomTextField from "../shared/CustomTextField";
import CustomButton from "../shared/CustomButton";
import {D} from "../cms/Editable";

const styles = theme => ({}
);

class ResetPassword extends Component {

    currentPassword = "";
    newPassword = "";
    repeatPassword = "";

    error = false;

    constructor(props) {
        super(props);
    }

    updatePassword = (e) => {
        e.preventDefault();
        this.props.onUpdatePassword({password: this.currentPassword, newPassword: this.newPassword});
    };

    handleChanges = () => {
        this.error = false;
        if(this.newPassword && this.repeatPassword){
            if(this.newPassword !== this.repeatPassword){
                this.error = true;
            }
        }
    };

    render() {
        const {onClose} = this.props;
        const {error} = this;
        return (<Dialog
            open={true}
            onClose={onClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">{D("Reset password")}</DialogTitle>
            <form onSubmit={this.updatePassword} onChange={this.handleChanges} aria-disabled={error ? "true" : "false"}>
                <DialogContent>
                    <CustomTextField label="Current password" id="current-password"
                                     type="password"
                                     required
                                     value={this.currentPassword}
                                     onChange={(e) => this.currentPassword = e.target.value}
                                     margin="dense" autoFocus/>
                    <CustomTextField label="New password" id="new-password"
                                     type="password"
                                     required
                                     error={error}
                                     value={this.newPassword}
                                     onChange={(e) => this.newPassword = e.target.value}
                                     margin="dense"
                    />
                    <CustomTextField label="Repeat password" id="repeat-password"
                                     type="password"
                                     required
                                     error={error}
                                     value={this.repeatPassword}
                                     onChange={(e) => this.repeatPassword = e.target.value}
                                     margin="dense"
                    />

                </DialogContent>
                <DialogActions >
                    <CustomButton onClick={onClose} color="primary">
                        Cancel
                    </CustomButton>
                    <CustomButton type="submit" color="primary" variant="raised" disabled={error}>
                        Update
                    </CustomButton>
                </DialogActions>
            </form>
        </Dialog>)
    }
}

export default withStyles(styles, {withTheme: true})(observer(ResetPassword));

decorate(ResetPassword, {
    currentPassword: observable,
    newPassword: observable,
    repeatPassword: observable,
    handleChanges: action
});

ResetPassword.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdatePassword: PropTypes.func.isRequired
}

ResetPassword.defaultProps = {}