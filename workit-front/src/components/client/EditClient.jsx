import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {action, autorun, decorate, observable, transaction} from 'mobx';
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
import Error from "../shared/Error";
import {success, error} from "../shared/Toast";

const styles = theme => ({}
);

class EditClient extends Component {

    client = {
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

    componentWillMount() {
        const {match, clientStore} = this.props;
        const {clientId} = match.params;
        clientStore.fetchClient(clientId)
            .then(client => {
                this.client = JSON.parse(JSON.stringify(client));
            });
        clientStore.fetchCurrentClientUsers(clientId)
            .then(users => {
                transaction(() => {
                    this.users = users.users || [];
                    this.admins = users.admins || [];
                })
            })
            .catch(err => error(err.message));
    }

    updateClient = (evt) => {
        evt.preventDefault();
        //only map the required properties
        this.client.users = this.users.map(u => u.id);
        this.client.admins = this.admins.map(u => u.id);
        this.props.clientStore.updateClient(this.client)
            .then(updated => {
                success(`${updated.name} has been updated`);
                this.props.history.push(Links.client(updated.id));
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
        const {isLoading, hasError, error} = clientStore.status.currentClient;

        if (isLoading) return <LinearProgress color="secondary"/>;
        if(hasError) return <Error message={error} />;
        const {name, id} = this.client;
        const {users, admins} = this;
        const updating = clientStore.status.updateClient.isLoading;
        return (
            <form onSubmit={this.updateClient}>
                {updating && <LinearProgress color="secondary"/>}
                <Grid container direction={"column"} spacing={16}>
                    <Grid item>
                        <Title>Manage client</Title>
                    </Grid>
                    <Grid item>
                        <CustomTextField label={"Name"}
                                         onChange={(evt) => this.client.name = evt.target.value}
                                         value={name}
                                         required/>
                    </Grid>
                    <Grid item>
                        <CustomTextField label={"Client id"} disabled value={id}/>
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
                        <CustomButton color="primary" variant="raised" type={"submit"}
                                      disabled={updating}>Update</CustomButton>
                    </Grid>
                </Grid>
            </form>
        )
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(inject("userStore", "clientStore")(observer(EditClient))));

decorate(EditClient, {
    client: observable,
    selectedUsers: observable,
    handleUsersChanged: action,
    handleInputChange: action,
    updateClient: action,
    users: observable,
    admins: observable
});


EditClient.propTypes = {
    clientStore: PropTypes.instanceOf(ClientStore),
    userStore: PropTypes.instanceOf(UserStore),
    match: PropTypes.object.isRequired
};

EditClient.defaultProps = {};