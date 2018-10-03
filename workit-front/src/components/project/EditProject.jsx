import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from 'mobx-react';
import {decorate, action, reaction, observable, computed, transaction, runInAction} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import {Title} from "../shared/SimpleComponents";
import Grid from "@material-ui/core/Grid/Grid";
import CustomButton from "../shared/CustomButton";
import CustomTextField from "../shared/CustomTextField";
import SelectUsers from "../shared/SelectUsers";
import ProjectStore from "../../stores/ProjectStore";
import UserStore from "../../stores/UserStore";
import Error from "../shared/Error";
import ClientStore from "../../stores/ClientStore";
import {Links} from "../../config/Links";
import {success, error} from "../shared/Toast";

const styles = theme => ({}
);

class EditProject extends Component {

    project = {
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

    isLoading = false;

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {match, projectStore} = this.props;
        const {projectId} = match.params;

        const p1 = projectStore.fetchProject(projectId)
            .then(project => {
                this.project = JSON.parse(JSON.stringify(project));
            });
        const p2 = projectStore.fetchCurrentProjectUsers(projectId)
            .then(users => {
                runInAction(() => {
                    this.users = users.users || [];
                    this.editors = users.editors || [];
                    this.developers = users.developers || [];
                })
            });
        this.isLoading = true;
        Promise.all([p1, p2])
            .then(() => this.isLoading = false);
    }

    updateProject = (e) => {
        e.preventDefault();
        this.project.users = this.users.map(u => u.id);
        this.project.editors = this.editors.map(u => u.id);
        this.project.developers = this.developers.map(u => u.id);
        this.props.projectStore.updateProject(this.project)
            .then(updated => {
                if (updated) {
                    success(`${updated.id} has been updated`);
                    this.project = updated;
                    this.props.history.push(Links.project(updated.id));
                }
            })
            .catch(err => {
                error(err.message);
            })
    };

    queryClientUsers = (query) => {
        return this.props.clientStore.queryClientUsers(this.project.clientId, query);
    };

    queryAllUsers = (query) => {
        return this.props.userStore.getUserSuggestions(query);
    };

    render() {
        const {projectStore, userStore} = this.props;
        const {isUpdating, hasError, error} = projectStore;

        if (this.isLoading) return <LinearProgress color="secondary"/>;
        if (hasError) return <Error message={error}/>;

        const {id, name} = this.project;
        const {users, editors, developers} = this;
        return (
            <form onSubmit={this.updateProject}>
                <Title>Manage project</Title>
                <Grid container direction={"column"} spacing={16}>
                    <Grid item>
                        <CustomTextField label={"Project name"}
                                         required
                                         helperText={"Name of the project. This can be changed later if desired"}
                                         value={name}
                                         onChange={(e) => this.project.name = e.target.value}/>
                    </Grid>
                    <Grid item>
                        <CustomTextField label={"Project id"}
                                         disabled
                                         value={id}/>
                    </Grid>
                    <Grid item>
                        <SelectUsers label={"Users"}
                                     placeholder={"Add client users to this project"}
                                     helperText={"These users will only have read access to this project"}
                                     getUserSuggestions={this.queryClientUsers}
                                     selectedUsers={users}
                                     onUsersChanged={users => this.users = users}
                                     store={userStore}/>
                    </Grid>
                    <Grid item>
                        <SelectUsers label={"Editors"}
                                     placeholder={"Add editors for this project"}
                                     helperText={"These users will be able to create and update cases"}
                                     getUserSuggestions={this.queryClientUsers}
                                     selectedUsers={editors}
                                     onUsersChanged={users => this.editors = users}
                                     store={userStore}/>
                    </Grid>
                    <Grid item>
                        <SelectUsers label={"Developers"}
                                     placeholder={"Add developers to this project..."}
                                     getUserSuggestions={this.queryAllUsers}
                                     selectedUsers={developers}
                                     onUsersChanged={users => this.developers = users}
                                     store={userStore}/>
                    </Grid>
                    <Grid item>
                        <CustomButton variant="raised" color="primary" type="submit" disabled={isUpdating}
                                      onClick={this.updateProject}>Save</CustomButton>
                    </Grid>
                </Grid>
            </form>
        )
    }
}

export default withStyles(styles, {withTheme: true})(inject("clientStore", "projectStore", "userStore")(observer(EditProject)));

decorate(EditProject, {
    project: observable,
    users: observable,
    editors: observable,
    developers: observable,
    isLoading: observable
});

EditProject.propTypes = {
    classes: PropTypes.object.isRequired,
    clientStore: PropTypes.instanceOf(ClientStore),
    projectStore: PropTypes.instanceOf(ProjectStore),
    userStore: PropTypes.instanceOf(UserStore),
    match: PropTypes.object.isRequired
}

EditProject.defaultProps = {}