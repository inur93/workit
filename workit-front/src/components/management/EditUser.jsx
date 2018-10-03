import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, observable} from 'mobx';
import {
    TextField,
    Button, Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Input,
    InputLabel, MenuItem,
    Select, withStyles
} from "@material-ui/core";
import User from "../../models/management/User";
import {MenuProps, styles} from "../../Theme";


class EditUser extends Component {

    username = "";
    roles = [];

    constructor(props) {
        super(props);
        this.roles = props.user.roles.map(role => {
            return props.roles.find(r => r.id === role.id);
        });
        this.username = props.user.username;

    }

    handleChange = (selected) => {
        this.roles = selected.target.value.map(v => this.props.roles.find(r => r.id === v));
    }

    save = () => {
        this.props.onSave({
            id: this.props.user.id,
            username: this.username,
            roles: this.roles
        });
    }

    delete = () => {
        this.props.onDelete(this.props.user);
    }

    render() {
        const {onClose, onSave, roles, user, classes, theme} = this.props;
        const {username} = this;
        const selectedRoles = this.roles;
        return (
            <Dialog open={true}>
                <DialogTitle>Update user</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth className={classes.formControl}>
                        <TextField
                            label={"username"}
                            value={username}
                            onChange={(evt) => this.username = evt.target.value}
                        />
                    </FormControl>
                    <FormControl fullWidth className={classes.formControl}>
                        <InputLabel htmlFor="select-multiple-chip">Roles</InputLabel>
                        <Select
                            multiple
                            value={selectedRoles.map(s => s.id)}
                            onChange={this.handleChange}
                            input={<Input id="select-multiple-chip"/>}
                            renderValue={selected => {
                                let list = selected.map(s => roles.find(r => r.id === s));
                                return (
                                    <div className={classes.chips}>
                                        {list.map(role => <Chip key={role.id} label={role.name}
                                                                className={classes.chip}/>)}
                                    </div>
                                )
                            }}
                            MenuProps={MenuProps}
                        >
                            {roles.map(role => (
                                <MenuItem
                                    key={role.id}
                                    value={role.id}
                                    style={{
                                        fontWeight:
                                            selectedRoles.indexOf(role) === -1
                                                ? theme.typography.fontWeightRegular
                                                : theme.typography.fontWeightMedium,
                                    }}
                                >
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button color="primary"
                            variant="raised"
                            onClick={this.save}>Save</Button>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(EditUser));

EditUser.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    user: PropTypes.instanceOf(User),
    roles: PropTypes.object
}

EditUser.defaultProps = {}

decorate(EditUser, {
    username: observable,
    roles: observable
})