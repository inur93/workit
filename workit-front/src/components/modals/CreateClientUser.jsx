import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import Transition from "react-transition-group/Transition";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Editable, {D} from "../cms/Editable";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Grid from "@material-ui/core/Grid/Grid";
import CustomTextField from "../shared/CustomTextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import CustomButton from "../shared/CustomButton";
import Dialog from "@material-ui/core/Dialog/Dialog";
import Switch from "@material-ui/core/Switch/Switch";
import Collapse from "@material-ui/core/Collapse/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import UserStore from "../../stores/UserStore";

const styles = theme => ({}
);

class CreateClientUser extends Component {

    generatePassword = true;
    repeatedPassword = "";
    hasError = false;

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {defaultValue, store} = this.props;
        if (defaultValue && defaultValue.includes("@")) {
            store.newUser.email = defaultValue;
        } else {
            store.newUser.name = defaultValue;
        }
    }

    togglePassword = (evt) => {
        this.generatePassword = evt.target.checked;
    };

    createUser = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        this.props.store.createUser()
            .then(created => {
                this.props.onCreate(created);
            });
    };

    updateValidation = () => {
        this.hasError = false; //assume no errors
        const {repeatedPassword} = this;
        const {store} = this.props;
        if (!this.generatePassword) {
            //validate password inputs
            if (store.newUser.password.length > 0 && repeatedPassword.length > 0) {
                if (store.newUser.password !== repeatedPassword) {
                    this.hasError = true;
                }
            }
        }
    };

    render() {
        const {email, name, password} = this.props.store.newUser;
        const {generatePassword, repeatedPassword, hasError} = this;
        const {open, onClose} = this.props;

        return (
            <Dialog
                fullWidth
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={onClose}
                aria-labelledby="create-user-title"
                aria-describedby="create-user-description"
            >
                <form onSubmit={this.createUser} onChange={this.updateValidation}>
                    <DialogTitle id="create-user-title">
                        <Editable field={"Create user"}/>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={16} direction={"column"}>
                            <Grid item>
                                <CustomTextField label="Email"
                                                 helperText="This will also be the users username"
                                                 type="email"
                                                 required
                                                 onChange={(e) => this.props.store.newUser.email = e.target.value}
                                                 value={email}/>
                            </Grid>
                            <Grid item>
                                <CustomTextField label="Name"
                                                 helperText="The users full name"
                                                 required
                                                 onChange={(e) => this.props.store.newUser.name = e.target.value}
                                                 value={name}/>
                            </Grid>
                            <Grid item>
                                <FormControlLabel control={
                                    <Switch color="primary"
                                            checked={generatePassword}
                                            value={"generate-password"}
                                            onChange={this.togglePassword}/>}
                                                  label={D(generatePassword ? "Send generated password in email" : "Enter password manually")}
                                />
                            </Grid>
                            <Collapse in={!generatePassword}>
                                <Grid item>
                                    <Grid container direction={"column"} spacing={16}>
                                        <Grid item>
                                            <CustomTextField label="Password" type="password"
                                                             error={hasError}
                                                             required={!generatePassword}
                                                             onChange={(e) => this.props.store.newUser.password = e.target.value}
                                                             value={password}/>
                                        </Grid>
                                        <Grid item>
                                            <CustomTextField label="Repeat password" type="password"
                                                             error={hasError}
                                                             required={!generatePassword}
                                                             onChange={(e) => this.repeatedPassword = e.target.value}
                                                             value={repeatedPassword}/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <CustomButton onClick={onClose} color="primary">
                            Cancel
                        </CustomButton>
                        <CustomButton type="submit" variant="raised" color="primary" disabled={hasError}>
                            Create
                        </CustomButton>
                    </DialogActions>
                </form>
            </Dialog>

        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(CreateClientUser));

decorate(CreateClientUser, {
    repeatedPassword: observable,
    generatePassword: observable,
    hasError: observable,
    updateValidation: action
});

CreateClientUser.propTypes = {
    defaultValue: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    open: PropTypes.bool,
    store: PropTypes.instanceOf(UserStore)
};

CreateClientUser.defaultProps = {
    defaultValue: "",
    open: true
};