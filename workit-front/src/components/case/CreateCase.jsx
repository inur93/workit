import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {autorun, decorate, observable} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import CaseStore from "../../stores/CaseStore";
import Grid from "@material-ui/core/Grid/Grid";
import {Title} from "../shared/SimpleComponents";
import CustomTextField from "../shared/CustomTextField";
import ProjectStore from "../../stores/ProjectStore";
import SimpleSelect from "../shared/SimpleSelect";
import CustomButton from "../shared/CustomButton";
import {withRouter} from "react-router-dom";
import {Links} from "../../config/Links";
import SelectUsers from "../shared/SelectUsers";
import UserStore from "../../stores/UserStore";
import Perm from "../management/Perm";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import {Policies} from "../../config/Policies";
import {success, error} from "../shared/Toast";
import {D} from "../cms/Editable";

const styles = theme => ({});

class CreateCase extends Component {

    userSuggestions = [];
    responsible = [];
    newCase = {
        projectId: "",
        title: "",
        description: "",
        priority: "",
        status: "",
        comments: [],
        responsible: null,
        estimate: "",
    };

    disposer;
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        const {projectStore, match} = this.props;
        const {projectId} = match.params;
        this.disposer = autorun(() => {
            const {currentProject} = projectStore;
            if (currentProject) {
                //set default values
                this.newCase.projectId = currentProject.id;
                if (currentProject.configuration && currentProject.configuration.statusValues) {
                    this.newCase.status = currentProject.configuration.statusValues[0];
                }
            }
        });
        projectStore.fetchProject(projectId);
    }

    componentWillUnmount(){
        if(this.disposer) this.disposer();
    }

    handlePriorityChange = (evt) => {
        this.newCase.priority = evt.target.value;
    };

    handleStatusChange = (evt) => {
        this.newCase.status = evt.target.value;
    };

    create = (evt) => {
        evt.preventDefault();
        const {projectId} = this.props.match.params;
        this.newCase.responsible = this.responsible.length > 0 ? this.responsible[0] : null;
        this.props.caseStore.createCase(projectId, this.newCase)
            .then((aCase) => {
                this.props.caseStore.reloadProjectCases();
                this.props.history.push(Links.project(projectId));
                success(`${D("Created new case")} ${aCase.id}`);
            })
            .catch((err) => {
                error(err.message);
            });
    };

    handleResponsibleChanged = (value) => {
        this.responsible = value ? [value] : [];
    };

    queryProjectUsers = (query) => {
        const {projectId} = this.props.match.params;
        return this.props.projectStore.queryProjectUsers(projectId, query);
    }

    render() {
        const {projectStore, userStore, match} = this.props;
        const {projectId} = match.params;
        const {currentProject} = projectStore;
        const {title, description, priority, estimate} = this.newCase;
        const {responsible} = this;
        return (
            <form onSubmit={this.create}>
                <Grid container direction={"column"} spacing={16}>
                    <Grid item>
                        <Title>Create new case</Title>
                    </Grid>
                    {projectStore.isLoading && <LinearProgress color="secondary" />

                    }
                    <Grid item>
                        <CustomTextField label={"Title"}
                                         required
                                         value={title}
                                         onChange={e => this.newCase.title = e.target.value}/>
                    </Grid>
                    <Grid item>
                        <CustomTextField label={"Description"}
                                         required
                                         value={description}
                                         multiline
                                         rowsMax={10}
                                         onChange={e => this.newCase.description = e.target.value}/>
                    </Grid>
                    <Grid item>
                        <SimpleSelect label={"Priority"}
                                      required
                                      handleChange={this.handlePriorityChange}
                                      selected={priority}
                                      values={currentProject &&
                                      currentProject.configuration &&
                                      currentProject.configuration.priorityValues || []}/>
                    </Grid>
                    <Grid item>
                        <SimpleSelect label={"Status"}
                                      required
                                      handleChange={this.handleStatusChange}
                                      selected={this.newCase.status}
                                      values={currentProject &&
                                      currentProject.configuration &&
                                      currentProject.configuration.statusValues || []}/>
                    </Grid>
                    <Perm permissions={Policies.projectDeveloper(projectId)}>
                        <Grid item>
                            <CustomTextField label={"Estimate"}
                                             type="number"
                                             fullWidth={false}
                                             onChange={evt => this.newCase.estimate = evt.target.value}
                                             value={estimate}/>
                        </Grid>
                    </Perm>
                    <Perm permissions={Policies.projectDeveloper(projectId)}>
                        <Grid item>
                            <SelectUsers enableAdd={false}
                                         multiple={false}
                                         selectedUsers={responsible}
                                         getUserSuggestions={this.queryProjectUsers}
                                         onUsersChanged={this.handleResponsibleChanged}
                                         store={userStore}
                                         label={"Responsible"}
                                         placeholder={"Select responsible..."}/>
                        </Grid>
                    </Perm>
                    <Grid item>
                        <CustomButton variant="raised"
                                      color="primary"
                                      type="submit">Create</CustomButton>
                    </Grid>
                </Grid>
            </form>
        )
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(inject("caseStore", "projectStore", "userStore")(observer(CreateCase))));

decorate(CreateCase, {
    newCase: observable,
    responsible: observable,
    userSuggestions: observable
});

CreateCase.propTypes = {
    match: PropTypes.object.isRequired,
    caseStore: PropTypes.instanceOf(CaseStore),
    projectStore: PropTypes.instanceOf(ProjectStore),
    userStore: PropTypes.instanceOf(UserStore),

};

CreateCase.defaultProps = {};