import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed, autorun} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField/TextField";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Grid from "@material-ui/core/Grid/Grid";
import CustomTextField from "../shared/CustomTextField";
import UserStore from "../../stores/UserStore";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import CustomButton from "../shared/CustomButton";
import ResetPassword from "../modals/ResetPassword";
import {success, error} from "../shared/Toast";

const styles = theme => ({}
);

class MyProfile extends Component {

    user = null;
    showResetPassword = false;

    constructor(props) {
        super(props);
    }

    disposer;

    componentWillMount() {
        this.disposer = autorun(() => {
            const self = this.props.userStore.self;
            if (self) {
                this.user = JSON.parse(JSON.stringify(self));
                if(this.disposer)this.disposer();
            }
        })
    }

    updatePassword = (data) => {
        data.id = this.user.id;
        this.props.userStore.updateSelfPassword(data)
            .then(() => {
                this.showResetPassword = false;
                success("Your password has been updated");
            })
            .catch(err => {
                error(err.message);
            })
    };

    updateUser = (e) => {
        e.preventDefault();
        this.props.userStore.updateSelf(this.user)
            .then(() => {
                success("Your profile has been saved")
            })
            .catch(err => {
                error(err.message)
            })
    }

    render() {
        const {showResetPassword} = this;
        const {isUpdating} = this.props.userStore;
        if (!this.user) return <LinearProgress color="secondary"/>;
        return (
            <div>
                {showResetPassword &&
                <ResetPassword onClose={() => this.showResetPassword = false}
                               onUpdatePassword={this.updatePassword}/>}
                <form onSubmit={this.updateUser}>
                    <Grid container spacing={16} direction="column">

                        <Grid item>
                            <CustomTextField
                                value={this.user.email || ""}
                                disabled
                                helperText="This also your username"
                                margin="dense"
                                id="email"
                                label="Email"
                                type="email"
                            />
                        </Grid>
                        <Grid item>
                            <CustomTextField
                                autoFocus
                                value={this.user.name || ""}
                                onChange={(e) => this.user.name = e.target.value}
                                margin="dense"
                                id="name"
                                label="Name"
                            />
                        </Grid>

                        <Grid item>
                            <Grid container spacing={8}>
                                <Grid item>
                                    <CustomButton disabled={isUpdating} type="submit" variant="raised" color="primary">Save</CustomButton>
                                </Grid>
                                <Grid item>
                                    <CustomButton color="primary" onClick={() => this.showResetPassword = true}>
                                        Update password</CustomButton>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                </form>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(inject("userStore")(observer(MyProfile)));

decorate(MyProfile, {
    user: observable,
    showResetPassword: observable
});

MyProfile.propTypes = {
    classes: PropTypes.object.isRequired,
    userStore: PropTypes.instanceOf(UserStore)
}

MyProfile.defaultProps = {}