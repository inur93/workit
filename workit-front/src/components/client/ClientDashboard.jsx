import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import ClientStore from "../../stores/ClientStore";
import {Title} from "../shared/SimpleComponents";
import {LinearProgress} from "@material-ui/core";
import Grid from "@material-ui/core/Grid/Grid";
import CustomButton from "../shared/CustomButton";
import Collapse from "@material-ui/core/Collapse/Collapse";
import CustomTextField from "../shared/CustomTextField";
import ProjectStore from "../../stores/ProjectStore";
import {Link, withRouter} from "react-router-dom";
import {Links} from "../../config/Links";
import ProjectList from "../lists/ProjectList";
import Perm from "../management/Perm";
import {Policies} from "../../config/Policies";
import Error from "../shared/Error";
import {D} from "../cms/Editable";


const styles = theme => ({}
);

class ClientDashboard extends Component {

    constructor(props) {
        super(props);

    }

    componentWillMount(){
        const {clientStore, projectStore, match} = this.props;
        const {clientId} = match.params;
        clientStore.fetchClient(clientId);
        projectStore.getByClientId(clientId);
    }

    render() {
        const {projects} = this.props.projectStore;
        const projectsLoading = this.props.projectStore.isLoading;
        const {currentClient} = this.props.clientStore;
        const {isLoading, hasError, error} = this.props.clientStore.status.currentClient;
        if (isLoading) return <LinearProgress color="secondary"/>;
        if(hasError) return <Error message={error}/>;
        const {name, id} = currentClient || {};
        return (
            <Grid container direction={"column"} spacing={16}>
                <Grid item>
                    <Title isStatic>{name} ({id})</Title>
                </Grid>
                <Grid item>
                    <Perm permissions={Policies.clientsIdCreate(id)}>
                    <CustomButton color={"primary"}
                                  variant={"raised"}
                                  component={Link}
                                  to={Links.createProject(id)}>Create project</CustomButton>
                    </Perm>
                </Grid>
                <Grid item>
                    {projectsLoading && <LinearProgress color="secondary"/>}
                    {!projectsLoading && !projects.length && <p>{D('No projects created for this client')}</p>}
                    {!projectsLoading && !!projects.length &&
                    <ProjectList projects={projects || []}/>
                    }
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(inject("clientStore", "projectStore")(observer(ClientDashboard))));

decorate(ClientDashboard, {});

ClientDashboard.propTypes = {
    match: PropTypes.object.isRequired,
    clientStore: PropTypes.instanceOf(ClientStore),
    projectStore: PropTypes.instanceOf(ProjectStore)
};

ClientDashboard.defaultProps = {};