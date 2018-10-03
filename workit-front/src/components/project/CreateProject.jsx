import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import CustomTextField from "../shared/CustomTextField";
import CustomButton from "../shared/CustomButton";
import {Title} from "../shared/SimpleComponents";
import {Links} from "../../config/Links";
import SelectUsers from "../shared/SelectUsers";
import {withRouter} from "react-router-dom";
import ProjectStore from "../../stores/ProjectStore";
import UserStore from "../../stores/UserStore";
import ClientStore from "../../stores/ClientStore";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import {success, error} from "../shared/Toast";

const styles = theme => ({}
);

class CreateProject extends Component {

    newProject = {
        clientId: "",
        name: "",
        id: "",
        users: [],
        editors: [],
        developers: []
    };

    users = [];
    editors = [];
    developers = [];

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        const {clientId} = this.props.match.params;
        this.props.clientStore.fetchCurrentClientUsers(clientId)
            .then(users => {
                let list = users.users || [];
                (users.admins || []).forEach(u => list.push(u));
                this.users = list;
            });
        this.newProject.clientId = this.props.clientId;
    }

    createProject = (e) => {
        e.preventDefault();
        const {clientId} = this.props.match.params;
        this.newProject.users = this.users.map(u => u.id);
        this.newProject.editors = this.editors.map(u => u.id);
        this.newProject.developers = this.developers.map(u => u.id);
        this.props.projectStore.createProject(clientId, this.newProject)
            .then(created => {
                success(`Created project ${created.id}`);
                this.props.history.push(Links.project(created.id));
            })
            .catch(err => {
                error(err.message);
            })
    };

    queryClientUsers = (query) => {
        return this.props.clientStore.queryClientUsers(this.props.match.params.clientId, query);
    };

    queryAllUsers = (query) => {
        return this.props.userStore.getUserSuggestions(query);
    };

    render() {
        const {userStore, clientStore} = this.props;
        const {isLoading} = clientStore.status.currentClient;
        return (
            <form onSubmit={this.createProject}>
                {isLoading && <LinearProgress color="secondary"/>}
                <Title>Create project</Title>
                <Grid container direction={"column"} spacing={16}>
                    <Grid item>
                        <CustomTextField label={"Project name"} required
                                         helperText={"Name of the project. This can be changed later if desired"}
                                         onChange={(e) => this.newProject.name = e.target.value}/>
                    </Grid>
                    <Grid item>
                        <CustomTextField label={"Project id"} required
                                         helperText={"This is a short identifier for the project. Note that this cannot be changed later on"}
                                         onChange={(e) => this.newProject.id = e.target.value}/>
                    </Grid>
                    <Grid item>
                        <SelectUsers label={"Users"}
                                     placeholder={"Add client users to this project"}
                                     getUserSuggestions={this.queryClientUsers}
                                     selectedUsers={this.users}
                                     onUsersChanged={users => this.users = users}
                                     store={userStore}/>
                    </Grid>
                    <Grid item>
                        <SelectUsers label={"Editors"}
                                     placeholder={"Add editors for this project"}
                                     helperText={"These users will be able to create and update cases"}
                                     getUserSuggestions={this.queryClientUsers}
                                     selectedUsers={this.editors}
                                     onUsersChanged={users => this.editors = users}
                                     store={userStore}/>
                    </Grid>
                    <Grid item>
                        <SelectUsers label={"Developers"}
                                     placeholder={"Add developers to this project..."}
                                     getUserSuggestions={this.queryAllUsers}
                                     selectedUsers={this.developers}
                                     onUsersChanged={users => this.developers = users}
                                     store={userStore}/>
                    </Grid>
                    <Grid item>
                        <CustomButton variant="raised" color="primary" type="submit">Create</CustomButton>
                    </Grid>
                </Grid>
            </form>
        )
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(inject("clientStore", "userStore", "projectStore")(observer(CreateProject))));

decorate(CreateProject, {
    createProject: action,
    users: observable,
    editors: observable,
    developers: observable,
    newProject: observable
});

CreateProject.propTypes = {
    match: PropTypes.object.isRequired,
    store: PropTypes.instanceOf(ProjectStore),
    clientStore: PropTypes.instanceOf(ClientStore),
    userStore: PropTypes.instanceOf(UserStore)
};

CreateProject.defaultProps = {};