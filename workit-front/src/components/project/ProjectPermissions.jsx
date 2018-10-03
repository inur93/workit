import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import {Title} from "../shared/SimpleComponents";
import {D} from "../cms/Editable";
import Collapse from "@material-ui/core/Collapse/Collapse";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import UserStore from "../../stores/UserStore";
import CustomButton from "../shared/CustomButton";

const styles = theme => ({}
);

class ProjectPermissions extends Component {

    selectedUser = null;
    users = [];

    constructor(props) {
        super(props);
    }

    componentWillMount(){
        const {projectId} = this.props.match.params;
        this.props.userStore.getUsersForProject(projectId)
            .then(users => {
                this.users = users;
            })
    }


    render() {
        const {selectedUser, users} = this;
        const {projectId} = this.props.match.params;
        return (
            <Grid container direction="column">
                <Grid item>
                    <Title isStatic>{D('Permissions for')} {projectId}</Title>
                </Grid>
                <Grid item>
                    <CustomButton variant="raised" color="primary" >Add user</CustomButton>
                </Grid>
                <Grid item>
                    <Collapse in={!!this.selectedUser}>
                        <List component="nav">
                            {users.map(u => <ListItem key={u.id}
                                                      button
                                                      selected={selectedUser && selectedUser.id === u.id}
                                                      onClick={() => this.selectedUser = u}>
                                <ListItemText primary={u.name} secondary={u.email}/>
                            </ListItem>)

                            }
                        </List>
                    </Collapse>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles, {withTheme: true})(inject("userStore")(observer(ProjectPermissions)));

decorate(ProjectPermissions, {
    selectedUser: observable,
    users: observable
});

ProjectPermissions.propTypes = {
    classes: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    userStore: PropTypes.instanceOf(UserStore)

}

ProjectPermissions.defaultProps = {}