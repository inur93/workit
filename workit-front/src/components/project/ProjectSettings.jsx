import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import {Title} from "../shared/SimpleComponents";
import ProjectStore from "../../stores/ProjectStore";
import Editable from "../cms/Editable";
import CustomTextField from "../shared/CustomTextField";
import CustomButton from "../shared/CustomButton";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar/Avatar";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import OrderIcon from '@material-ui/icons/Menu'
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import SimpleListEditor from "../shared/SimpleListEditor";
import Divider from "@material-ui/core/Divider/Divider";

const styles = theme => ({}
);

class ProjectSettings extends Component {

    project = null;

    statusValues = [];
    priorityValues = [];

    newStatusValue = "";
    newPriorityValue = "";

    constructor(props) {
        super(props);

    }

    componentWillMount(){
        const {projectStore, match} = this.props;
        const {projectId} = match.params;
        projectStore.fetchProject(projectId)
            .then(fetched => {
                this.project = fetched;
                if (fetched.configuration) {
                    this.statusValues = fetched.configuration.statusValues || [];
                    this.priorityValues = fetched.configuration.priorityValues || [];
                }
            })
    }

    addNewStatusValue = () => {
        if (this.newStatusValue) {
            this.statusValues.push(this.newStatusValue);
            this.newStatusValue = "";
        }
    };

    addNewPriorityValue = () => {
        if (this.newPriorityValue) {
            this.priorityValues.push(this.newPriorityValue);
            this.newPriorityValue = "";
        }
    };

    removeStatus = (value) => {
        this.statusValues.splice(this.statusValues.indexOf(value), 1);
    };

    removePriority = (value) => {
        this.priorityValues.splice(this.priorityValues.indexOf(value), 1);
    };

    saveChanges = () => {
        if(!this.project.configuration) this.project.configuration = {};
        this.project.configuration.statusValues = this.statusValues;
        this.project.configuration.priorityValues = this.priorityValues;
        this.props.projectStore.saveProject(this.project);
    };

    render() {
        return (
            <Grid container direction={"column"} spacing={16}>
                <Grid item>
                    <Title>Settings</Title>
                </Grid>
                <Grid item>
                    <SimpleListEditor label={"Status"} value={this.newStatusValue} list={this.statusValues}
                                      onChange={(e) => this.newStatusValue = e.target.value}
                                      onAdd={this.addNewStatusValue}
                                      onRemove={this.removeStatus}/>
                </Grid>
                <Divider/>
                <Grid item>
                    <SimpleListEditor label={"Priority"} value={this.newPriorityValue} list={this.priorityValues}
                                      onChange={(e) => this.newPriorityValue = e.target.value}
                                      onAdd={this.addNewPriorityValue}
                                      onRemove={this.removePriority}/>
                </Grid>
                <Divider/>
                <Grid item>
                    <CustomButton variant="raised" color="primary" onClick={this.saveChanges}>Save</CustomButton>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles, {withTheme: true})(inject("projectStore")(observer(ProjectSettings)));

decorate(ProjectSettings, {
    project: observable,
    statusValues: observable,
    newStatusValue: observable,
    priorityValues: observable,
    newPriorityValue: observable,
    addNewStatusValue: action,
    addNewPriorityValue: action
});

ProjectSettings.propTypes = {
    projectStore: PropTypes.instanceOf(ProjectStore),
    match: PropTypes.object.isRequired
};

ProjectSettings.defaultProps = {};