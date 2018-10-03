import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {action, decorate, observable} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import CustomTextField from "../shared/CustomTextField";
import {Title} from "../shared/SimpleComponents";
import CustomButton from "../shared/CustomButton";
import Grid from "@material-ui/core/Grid/Grid";
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import {Links} from "../../config/Links";
import SelectUsers from "../shared/SelectUsers";
import UserStore from "../../stores/UserStore";
import ClientStore from "../../stores/ClientStore";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import {success, error} from "../shared/Toast";

const styles = theme => ({}
);

class CreateClient extends Component {

    newClient = {
        id: "",
        name: "",
        users: [],
        admins: []
    };

    users = [];
    admins = [];

    constructor(props) {
        super(props);
    }

    createClient = (evt) => {
        evt.preventDefault();
        //only map the required properties
        this.newClient.users = this.users.map(u => u.id);
        this.newClient.admins = this.admins.map(u => u.id);
        this.props.clientStore.createClient(this.newClient)
            .then(created => {
                success(`created client ${created.name}`);
                this.props.history.push(Links.client(created.id));
            })
            .catch(err => {
                error(err.message);
            });
    };

    handleUsersChanged = (users) => {
        this.users = users;
    };

    handleAdminsChanged = (users) => {
        this.admins = users;
    }

    render() {
        const {classes, clientStore, userStore} = this.props;
        const {name, id} = this.newClient;
        const {users, admins} = this;
        const {isCreating} = clientStore;
        return (
            <form onSubmit={this.createClient}>
                {isCreating && <LinearProgress color="secondary" />}
                <Grid container direction={"column"} spacing={16}>
                    <Grid item>
                        <Title>Setup new client</Title>
                    </Grid>
                    <Grid item>
                        <CustomTextField label={"Name"}
                                         helperText={"The name of the client. This can be changed later if desired"}
                                         onChange={(evt) => this.newClient.name = evt.target.value}
                                         value={name}
                                         required/>
                    </Grid>
                    <Grid item>
                        <CustomTextField label={"Client id"}
                                         helperText={"Short id for the client. Note that this cannot be changed later."}
                                         onChange={(evt) => this.newClient.id = evt.target.value}
                                         value={id}
                                         required/>
                    </Grid>
                    <Grid item>
                        <SelectUsers selectedUsers={users}
                                     getUserSuggestions={userStore.getUserSuggestions}
                                     onUsersChanged={this.handleUsersChanged}
                                     store={userStore}/>
                    </Grid>
                    <Grid item>
                        <SelectUsers placeholder={"Administrators for this client"}
                                     label={"Administrators"}
                                     selectedUsers={admins}
                                     getUserSuggestions={userStore.getUserSuggestions}
                                     onUsersChanged={this.handleAdminsChanged}
                                     store={userStore}/>
                    </Grid>
                    <Grid item>
                        <CustomButton color="primary" variant="raised" type={"submit"} disabled={isCreating}>Create</CustomButton>
                    </Grid>
                </Grid>
            </form>
        )
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(inject("clientStore", "userStore")(observer(CreateClient))));

decorate(CreateClient, {
    newClient: observable,
    selectedUsers: observable,
    handleUsersChanged: action,
    handleInputChange: action,
    createClient: action,
    users: observable,
    admins: observable
});

CreateClient.propTypes = {
    clientStore: PropTypes.instanceOf(ClientStore),
    userStore: PropTypes.instanceOf(UserStore)
};

CreateClient.defaultProps = {};