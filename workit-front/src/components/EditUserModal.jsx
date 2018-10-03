import React, {Component} from "react";
import {observer} from "mobx-react";
import {decorate, observable, action} from "mobx";
import PropTypes from 'prop-types';
import {FormControlLabel} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({

})

class EditUserModal extends Component {
    user = {};

    constructor(props) {
        super(props);
        if (props.user)
            this.user = JSON.parse(JSON.stringify(props.user));
    }

    handleSave = () => {
        this.props.onSave(this.user);
    };

    render() {
        let cancelEdit = this.props.cancelEdit;
        const {onClose} = this.props;
        return (<Dialog
            open={true}
            onClose={onClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Profile</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Update your profile information
                </DialogContentText>
                <TextField label="Username" id="username" value={this.user.username || ""} disabled fullWidth margin="dense"/>
                <TextField
                    autoFocus
                    value={this.user.firstname || ""}
                    onChange={(e) => this.user.firstname = e.target.value}
                    margin="dense"
                    id="firstname"
                    label="Firstname"
                    fullWidth
                />
                <TextField
                    value={this.user.lastname || ""}
                    onChange={(e) => this.user.lastname = e.target.value}
                    margin="dense"
                    id="lastname"
                    label="Lastname"
                    fullWidth
                />
                <TextField
                    value={this.user.email || ""}
                    onChange={(e) => this.user.email = e.target.value}
                    margin="dense"
                    id="email"
                    label="Email"
                    type="email"
                    fullWidth
                />
                <TextField
                    margin="dense"
                    id="new-password"
                    label="New password"
                    type="password"
                    fullWidth
                />
                <TextField
                    margin="dense"
                    id="repeat-password"
                    label="Repeat password"
                    type="password"
                    fullWidth
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={this.handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>);
    }
}

export default withStyles(styles, {withTheme: true})(observer(EditUserModal));

decorate(EditUserModal, {
    user: observable,
    handleRoleChange: action
});

EditUserModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    user: PropTypes.object,
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired


}