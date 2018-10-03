import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed, transaction} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import {Links} from "../../config/Links";
import Grid from "@material-ui/core/Grid/Grid";
import {Title} from "../shared/SimpleComponents";
import CustomTextField from "../shared/CustomTextField";
import SimpleSelect from "../shared/SimpleSelect";
import CustomButton from "../shared/CustomButton";
import CaseStore from "../../stores/CaseStore";
import ProjectStore from "../../stores/ProjectStore";
import {Link, withRouter} from "react-router-dom";
import CommentList from "./CommentList";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import SelectUsers from "../shared/SelectUsers";
import UserStore from "../../stores/UserStore";
import {hasPerm} from "../management/Perm";
import Typography from "@material-ui/core/Typography/Typography";
import {Policies} from "../../config/Policies";
import {D} from "../cms/Editable";

const styles = theme => ({}
);

class EditCase extends Component {

    aCase = null;

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {projectStore, caseStore, match} = this.props;
        const {projectId, caseId} = match.params;
        projectStore.fetchProject(projectId);
        caseStore.getCase(projectId, caseId)
            .then(fetched => {
                this.aCase = JSON.parse(JSON.stringify(fetched));
            })
    }
    queryProjectUsers = (query) => {
        const {match, projectStore} = this.props;
        return projectStore.queryProjectUsers(match.params.projectId, query, "developers");
    }

    handlePriorityChange = (evt) => {
        this.aCase.priority = evt.target.value;
    };

    handleStatusChange = (evt) => {
        this.aCase.status = evt.target.value;
    };

    save = () => {
        const {projectId, caseId} = this.props.match.params;
        this.props.caseStore.updateCase(projectId, caseId, this.aCase)
            .then(res => {
                this.props.history.push(Links.project(projectId));
            })
    };

    render() {
        const isLoadingProject = this.props.projectStore.isLoading;
        const isLoadingCase = this.props.caseStore.isLoading;
        if (isLoadingProject || isLoadingCase || !this.aCase) return <LinearProgress color="secondary"/>;
        const {configuration} = this.props.projectStore.currentProject;
        const {classes, userStore, match} = this.props;
        const {projectId, caseId} = match.params;
        const {title, description, estimate, priority, status, comments, responsible, newComment} = this.aCase;
        return (
            <Grid container direction={"column"} spacing={16}>
                <Grid item>
                    <Title>Edit case</Title>
                </Grid>
                <Grid item>
                    <CustomTextField label={"Title"} value={title}
                                     onChange={e => this.aCase.title = e.target.value}/>
                </Grid>
                <Grid item>
                    <CustomTextField label={"Description"} value={description} multiline rowsMax={10}
                                     onChange={e => this.aCase.description = e.target.value}/>
                </Grid>
                <Grid item>
                    <SimpleSelect label={"Priority"} handleChange={this.handlePriorityChange}
                                  selected={priority}
                                  values={configuration.priorityValues}/>
                </Grid>
                <Grid item>
                    <SimpleSelect label={"Status"} handleChange={this.handleStatusChange}
                                  selected={status} values={configuration.statusValues}/>
                </Grid>
                <Grid item>
                    <CustomTextField label={"Estimate"}
                                     value={estimate}
                                     disabled={!hasPerm(Policies.projectDeveloper(projectId, caseId))}
                                     onChange={e => this.aCase.estimate = e.target.value}/>
                </Grid>
                <Grid item>
                    {hasPerm(Policies.projectDeveloper(projectId, caseId)) ?
                        <SelectUsers label={"Responsible"}
                                     store={userStore}
                                     multiple={false}
                                     enableAdd={false}
                                     placeholder={"Select responsible for progress of this case"}
                                     selectedUsers={responsible ? [responsible] : []}
                                     getUserSuggestions={this.queryProjectUsers}
                                     onUsersChanged={user => {
                                         if(user) {
                                             this.aCase.responsible = {
                                                 id: user.id,
                                                 email: user.email,
                                                 name: user.name
                                             };
                                         }else{
                                             this.aCase.responsible = null;
                                         }
                                     }}
                        /> :
                        <CustomTextField label={"Responsible"}
                                         value={responsible ? `${responsible.name || ""} (${responsible.email})` : "No responsible"}
                                         disabled
                        />
                    }


                </Grid>
                <Grid item>
                    <Grid container spacing={16}>
                        <Grid item xs={3} md={2}>
                            <Typography className={classes.rowHeader} variant={"body2"}>
                                {D("Comments")}
                            </Typography>
                        </Grid>

                        {(!comments || !comments.length) ?
                            <Grid item xs={12}>
                                <p>{D("No comments")}</p>
                            </Grid> :
                            <Grid item xs={9} md={10}>
                                <CommentList comments={comments}/>
                            </Grid>
                        }

                        <Grid item xs={12}>
                            <CustomTextField label={"Comment"} multiline maxrows={10}
                                             value={newComment.text}
                                             onChange={e => this.aCase.newComment.text = e.target.value}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container spacing={8}>
                        <Grid item>
                            <CustomButton color="primary" component={Link}
                                          to={Links.viewCase(projectId, caseId)}>Cancel</CustomButton>
                        </Grid>
                        <Grid item>
                            <CustomButton variant="raised" color="primary" onClick={this.save}>Save</CustomButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(inject("userStore", "projectStore", "caseStore")(observer(EditCase))));


decorate(EditCase, {
    aCase: observable
});

EditCase.propTypes = {
    match: PropTypes.object.isRequired,
    caseStore: PropTypes.instanceOf(CaseStore),
    userStore: PropTypes.instanceOf(UserStore),
    projectStore: PropTypes.instanceOf(ProjectStore)
};