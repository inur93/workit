import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import Editable from "./cms/Editable";
import {Title} from "./shared/SimpleComponents";
import Grid from "@material-ui/core/Grid/Grid";
import PropTypes from 'prop-types';
import ProjectList from "./lists/ProjectList";
import CaseList from "./lists/CaseList";
import ProjectStore from "../stores/ProjectStore";
import CaseStore from "../stores/CaseStore";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

class Home extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {projectStore, caseStore} = this.props;
        projectStore.getProjectsForSelf();
        caseStore.reloadHomeCases();
    }


    render() {

        const {caseStore, projectStore} = this.props;
        const {currentUserProjects} = projectStore;
        const casesLoading = caseStore.home.isLoading;
        const projectsLoading = projectStore.isLoading;
        return (
            <Grid container spacing={16} direction={"column"}>
                <Grid item>
                    <Title>Projects</Title>
                    {projectsLoading && <LinearProgress color="secondary"/>}
                    {(!projectsLoading && (currentUserProjects.length === 0)) ?
                        <p>You have no projects</p> :
                        <ProjectList projects={currentUserProjects}/>}
                </Grid>
                <Grid item>
                    <Title>My cases</Title>
                    {casesLoading && <LinearProgress color="secondary"/>}
                    {(!casesLoading && (caseStore.home.cases.length === 0)) ?
                        <p>You have no cases</p> :
                        <CaseList store={caseStore.home}/>}
                </Grid>
            </Grid>
        )
    }
}

export default inject("caseStore", "projectStore")(observer(Home));
Home.propTypes = {
    projectStore: PropTypes.instanceOf(ProjectStore),
    caseStore: PropTypes.instanceOf(CaseStore)
};

Home.defaultProps = {};