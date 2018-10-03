import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed, autorun} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import {Title} from "../shared/SimpleComponents";
import Grid from "@material-ui/core/Grid/Grid";
import CustomButton from "../shared/CustomButton";
import Collapse from "@material-ui/core/Collapse/Collapse";
import {Link, withRouter} from "react-router-dom";
import {Links} from "../../config/Links";
import CreateCase from "../case/CreateCase";
import CaseList from "../lists/CaseList";
import CaseStore from "../../stores/CaseStore";
import ProjectStore from "../../stores/ProjectStore";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import Error from "../shared/Error";
import Perm from "../management/Perm";
import {Policies} from "../../config/Policies";
import {D} from "../cms/Editable";

const styles = theme => ({}
);

class ProjectDashBoard extends Component {


    constructor(props) {
        super(props);
    }

    componentWillMount(){
        const {projectId} = this.props.match.params;
        this.props.projectStore.fetchProject(projectId);
        this.props.caseStore.reloadProjectCases(projectId);
    }


    render() {
        const {isLoading, currentProject, hasError, error} = this.props.projectStore;
        const {projectId} = this.props.match.params;
        const casesLoading = this.props.caseStore.project.isLoading;
        const cases = this.props.caseStore.project.cases;
        if(isLoading) return <LinearProgress color="secondary"/>;
        if(hasError) return <Error message={error}/>;
        return (
            <Grid container direction={"column"} spacing={16}>
                <Grid item>
                    <Title isStatic>{currentProject.name} ({currentProject.id})</Title>
                </Grid>
                <Grid item>
                    <Grid container direction={"row"} spacing={16}>
                        <Grid item>
                            <Perm permissions={Policies.projectsIdCasesCreate(projectId)}>
                            <CustomButton variant="raised" color="primary"
                                          component={Link}
                                          to={Links.createCase(projectId)}>Create
                                case</CustomButton>
                            </Perm>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    {
                        casesLoading && <LinearProgress color="secondary"/>
                    }
                    {
                        (!casesLoading && cases.length) ?
                            <CaseList store={this.props.caseStore.project} /> :
                            <p>{D("No cases yet")}</p>

                    }
                </Grid>
            </Grid>
        )
    }
}

export default withRouter(withStyles(styles, {withTheme: true})(inject('projectStore', 'caseStore')(observer(ProjectDashBoard))));

decorate(ProjectDashBoard, {});

ProjectDashBoard.propTypes = {
    match: PropTypes.object.isRequired,
    projectStore: PropTypes.instanceOf(ProjectStore),
    caseStore: PropTypes.instanceOf(CaseStore)
};

ProjectDashBoard.defaultProps = {};