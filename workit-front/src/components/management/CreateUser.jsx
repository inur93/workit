import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, observable} from 'mobx';
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    withStyles
} from "@material-ui/core";
import {MenuProps, styles} from "../../Theme";
import Editable from "../cms/Editable";

class CreateUser extends Component {

    username = "";
    password ="";
    repeatPassword = "";
    roles = [];

    constructor(props) {
        super(props);
    }

    handleChange = (selected) => {
        this.roles = selected.target.value.map(v => this.props.roles.find(r => r.id === v));
    };

    onCreate = () => {
        this.props.onCreate({
            username: this.username,
            roles: this.roles.map(r => r.json)
        })
    };

    hasPasswordError = () => {
        const {password, repeatPassword} = this;
        if(password && repeatPassword){
            return password !== repeatPassword;
        }
        return false;
    }

    render() {
        const {onClose, classes, theme, roles} = this.props;
        const {username, password, repeatPassword} = this;
        const selectedRoles = this.roles;
        return (
            <Dialog open={true}>
                <DialogTitle><Editable useModal field="create-user"/></DialogTitle>
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

                    <FormControl  fullWidth className={classes.formControl}>
                        <TextField
                            error={this.hasPasswordError()}
                            type="password"
                            label={"Password"}
                            value={password}
                            onChange={(evt) => this.password = evt.target.value}
                        />
                        <TextField
                            error={this.hasPasswordError()}
                            type="password"
                            label={"Repeat password"}
                            value={repeatPassword}
                            onChange={(evt) => this.repeatPassword = evt.target.value}
                        />

                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="raised" onClick={this.onCreate}>
                        <Editable useModal field="create"/>
                    </Button>,
                    <Button onClick={onClose}>
                        <Editable useModal field="close"/>
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(CreateUser));

CreateUser.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    roles: PropTypes.object
}

CreateUser.defaultProps = {}

decorate(CreateUser, {
    username: observable,
    password: observable,
    repeatPassword: observable,
    roles: observable
})