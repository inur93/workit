import React, {Component} from 'react';
import ResourceStore from "../../stores/ManagementStore";
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles";
import {action, decorate, observable, runInAction, transaction} from "mobx";
import CreateRole from "./CreateRole";
import {observer} from "mobx-react";
import {Button, Card, CardActions, CardContent, CardHeader, Grid, Menu, MenuItem} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import {GroupAdd, PersonAdd} from '@material-ui/icons';
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import Tree from "./treeview/Tree";
import EditRole from "./EditRole";
import TableOverview from "./TableOverview";
import Perm from "./Perm";
import EditPolicy from "./EditPolicy";
import Policy from "../../models/management/Policy";
import {Policies} from "../../config/Policies";

const styles = theme => ({
    menuButton: {
        color: theme.palette.primary,
        marginLeft: 12,
        /*        marginLeft: -12,
                marginRight: 20,*/
    },
    addIcon: {
        position: 'absolute',
        top: theme.spacing.unit * 12,

        /*bottom: theme.spacing.unit * 4,*/
        right: theme.spacing.unit * 6,

    },
    actions: {
        '& button': {
            marginLeft: '5px'
        }
    }
})
const MODALS = {
    CREATE_ROLE: "CreateRole",
    EDIT_ROLE: "EditRole",
    CREATE_USER: "CreateUser",
    EDIT_USER: "EditUser",
    EDIT_RESOURCE: "EditResource",
    EDIT_POLICY: "EditPolicy"
};

const VIEWS = {
    RESOURCES: "Resources",
    ROLES: "Roles",
    USERS: "Users"
};

class Management extends Component {

    currentViewKey = 'management.currentView';
    currentView = localStorage.getItem(this.currentViewKey) || VIEWS.RESOURCES;
    currentModal = null;
    selectedTab = 0;
    selectedUser = null;
    selectedRole = null;
    selectedPolicy = null;
    addAnchor = null;

    constructor(props) {
        super(props);
        props.store.load();
    }

    /*###########
    ACTIONS
     ############*/

    changeView = (evt) => {
        this.currentView = evt.target.value;
        localStorage.setItem(this.currentViewKey, evt.target.value);
    };

    saveRole = (role) => {
        this.props.store.updateRole(role).then(() => this.currentModal = null);
    }

    deleteRole = (role) => {
        this.props.store.deleteRole(role).then(() => this.currentModal = null);
    }

    deleteUser = (user) => {
        this.props.store.deleteUser(user).then(() => this.currentModal = null);
    }

    createRole = (role) => {
        this.props.store.createRole(role)
            .then(() => {
                transaction(() => {
                    this.currentModal = null;
                    this.addAnchor = null;
                });
            });
    };

    createUser = (user) => {
        this.props.store.createUser(user)
            .then(() => {
                transaction(() => {
                    this.currentModal = null;
                    this.addAnchor = null;
                });
            })
    };

    saveUser = (user) => {
        this.props.store.updateUser(user)
            .then(() => {
                transaction(() => {
                    this.selectedUser = null;
                    this.currentModal = null;
                });
            })

    };

    handleUpdatePolicy = (json) => {
        const policy = new Policy(json, this.props.store);
        let promise;
        if (policy.id) {
            promise = this.props.store.updatePolicy(policy);
        } else {
            if (this.currentView === VIEWS.USERS) {
                promise = this.props.store.createPolicyForUser(this.props.store.currentUser, policy);
            } else if (this.currentView === VIEWS.ROLES) {
                promise = this.props.store.createPolicyForRole(this.props.store.currentRole, policy);
            }
        }
        if (promise) promise.then(() => this.currentModal = null);
    };

    handleUpdatePermissionForUser = (resource, user, permission, isAllowed) => {
        let policy = this.resolvePolicy(user, resource);
        //policy.allowed[permission.id] = isAllowed;
        policy.allowed.set(permission.id, isAllowed);
        if (!policy.id) {
            return this.props.store.createPolicyForUser(user, policy);
        } else {
            policy.allowed.set(permission.id, isAllowed);
            return this.props.store.updatePolicy(policy);
        }
    };

    handleUpdatePermissionForRole = (resource, role, permission, isAllowed) => {
        let policy = this.resolvePolicy(role, resource);
        //policy.allowed[permission.id] = isAllowed;
        policy.allowed.set(permission.id, isAllowed);
        if (!policy.id) {
            return this.props.store.createPolicyForRole(role, policy);
        } else {
            policy.allowed.set(permission.id, isAllowed);
            return this.props.store.updatePolicy(policy);
        }
    };

    resolvePolicy = (roleOrUser, resource) => {
        let policy = roleOrUser && roleOrUser.policies && roleOrUser.policies.find(p => p.resource.id === resource.id);
        if (!policy) {
            let resourceObj = this.props.store.resourcesFlat.find(r => r.id === resource.id);
            return new Policy({
                resource: resourceObj,
                allowed: {}
            }, this.props.store);
        } else {
            return policy;
        }
    }

    /*###########
    MODALS
     ############*/
    handleEditUser = (user) => {
        this.selectedUser = user;
        this.currentModal = MODALS.EDIT_USER;
    };

    handleEditRole = (role) => {
        this.selectedRole = role;
        this.currentModal = MODALS.EDIT_ROLE;
    };

    handleEditResource = (resource) => {
        this.selectedResource = resource;
        this.currentModal = MODALS.EDIT_RESOURCE;
    };

    handleEditPolicy = (resource) => {
        const user = this.props.store.currentUser;
        const role = this.props.store.currentRole;
        if (this.currentView === VIEWS.ROLES && role) {
            this.selectedPolicy = role.policies.find(p => p.resource.name === resource.name)
                || new Policy({resource: resource}, this.props.store);
            this.currentModal = MODALS.EDIT_POLICY;
        } else if (this.currentView === VIEWS.USERS && user) {
            this.selectedPolicy = user.policies.find(p => p.resource.name === resource.name)
                || new Policy({resource: resource}, this.props.store);
            this.currentModal = MODALS.EDIT_POLICY;
        }
    };

    handleCreateUser = () => {
        this.currentModal = MODALS.CREATE_USER;
    };

    handleCreateRole = () => {
        this.currentModal = MODALS.CREATE_ROLE;
    };

    /*############
    VIEWS
     #############*/

    getTreeProps = () => {
        const {RESOURCES, ROLES, USERS} = VIEWS;
        const {
            currentResource, currentRole, currentUser,
            resources, roles, users,
            roleTree, updateResources,
            isResourcesLoading, isUsersLoading, isRolesLoading
        } = this.props.store;
        switch (this.currentView) {
            case RESOURCES:
                return {
                    selected: currentResource,
                    isLoading: isResourcesLoading,
                    subHeader: "",
                    title: "Resources",
                    nodes: resources,
                    actions: [
                        <Perm permissions={Policies.admin()}
                              key="update-resources">
                            <Button color="primary"
                                    variant="raised"
                                    onClick={updateResources}>Update resources</Button>
                        </Perm>
                    ],
                    options: {
                        childProp: "subResources",
                        childElements: (resource) => resource.subResources,
                        onSelect: resource => this.props.store.currentResource = resource
                    }
                };
            case ROLES:
                return {
                    selected: currentRole,
                    isLoading: isRolesLoading,
                    subHeader: "",
                    title: "Roles",
                    nodes: roleTree,
                    actions: [
                        <Perm permissions={Policies.admin()} key="edit-role">
                            <Button color="primary"
                                    variant="raised"
                                    onClick={() => this.handleEditRole(currentRole)}>Edit role</Button>
                        </Perm>,
                        <Perm permissions={Policies.admin()} key="delete-role">
                            <Button color="primary"
                                    variant="raised"
                                    onClick={() => this.deleteRole(currentRole)}>
                                Delete role
                            </Button>
                        </Perm>],
                    options: {
                        childElements: role => role.children,
                        onSelect: role => this.props.store.currentRole = role,
                        editable: true,
                        onEdit: this.handleEditRole
                    }
                };
            case USERS:
                return {
                    selected: currentUser,
                    isLoading: isUsersLoading,
                    subHeader: currentUser && currentUser.roles.map(r => r.name).join(', ') || "This user has no role",
                    title: "Users",
                    nodes: users,
                    actions: [
                        <Perm permissions={Policies.admin()} key="edit-user">
                            <Button color="primary"
                                    variant="raised"
                                    onClick={() => this.handleEditUser(currentUser)}>
                                Edit user
                            </Button>
                        </Perm>,
                        <Perm permissions={Policies.admin()} key="delete-user">
                            <Button color="primary"
                                    variant="raised"
                                    onClick={() => this.deleteUser(currentUser)}>
                                Delete user
                            </Button>
                        </Perm>
                    ],
                    options: {
                        hasChildren: false,
                        onSelect: user => this.props.store.currentUser = user,
                        editable: true,
                        onEdit: this.handleEditUser,
                        nameProp: "username"
                    }
                };
        }
        return {};
    };

    getTableProps = () => {
        const {RESOURCES, ROLES, USERS} = VIEWS;
        const {
            currentResource, currentRole, currentUser,
            resources, roles, users,
            permissions, roleTree,
            isResourcesLoading, isRolesLoading, isUsersLoading
        } = this.props.store;
        switch (this.currentView) {
            case RESOURCES:
                return {
                    title: "Roles",
                    isLoading: isRolesLoading,
                    selected: currentResource,
                    list: roleTree,
                    permissions: permissions,
                    rowOptions: {
                        elementSelectable: true,
                        onEdit: this.handleEditRole,
                        onUpdatePermission: this.handleUpdatePermissionForRole,
                        hasPermission:
                            (role, resource, permission) => {
                                if (!role) return false;
                                return role.hasPermission(resource, permission);
                            },
                        isPermissionAvailable:
                            (role, resource, permission) => {
                                if (!resource) return false;
                                return resource.availablePermissions.find(a => a === permission.name);
                            }
                    }
                };
            case ROLES:
                return {
                    title: "Resources",
                    isLoading: isResourcesLoading,
                    selected: currentRole,
                    permissions: permissions,
                    list: resources,
                    rowOptions: {
                        elementSelectable: true,
                        onEdit: this.handleEditPolicy,
                        onUpdatePermission: this.handleUpdatePermissionForRole,
                        hasPermission: (resource, role, permission) => {
                            if (!role) return false;
                            return role.hasPermission(resource, permission);
                        },
                        isPermissionAvailable: (resource, role, permission) => {
                            if (!resource) return false;
                            return resource.availablePermissions.find(a => a === permission.name);
                        },
                        childProp: "subResources"
                    }

                }
            case USERS:
                return {
                    title: "Resources",
                    isLoading: isResourcesLoading,
                    selected: currentUser,
                    permissions: permissions,
                    list: resources,
                    rowOptions: {
                        elementSelectable: true,
                        onEdit: this.handleEditPolicy,
                        onUpdatePermission: this.handleUpdatePermissionForUser,
                        hasPermission: (resource, user, permission) => {
                            if (!user) return false;
                            return user.hasPermission(resource, permission);
                        },
                        isPermissionAvailable: (resource, user, permission) => {
                            if (!resource) return false;
                            return resource.availablePermissions.find(a => a === permission.name);
                        },
                        childProp: "subResources"
                    }
                }
        }
    }

    getModal = (modal, store) => {
        const {roles} = store;
        const {selectedUser, selectedRole, selectedPolicy} = this;
        const {CREATE_ROLE, CREATE_USER, EDIT_ROLE, EDIT_USER, EDIT_RESOURCE, EDIT_POLICY} = MODALS;
        const onClose = () => this.currentModal = null;
        switch (modal) {
            case CREATE_ROLE:
                return <CreateRole roles={roles} onCreate={this.createRole} onClose={onClose}/>;
            case CREATE_USER:
                return <CreateUser roles={roles} onCreate={this.createUser} onClose={onClose}/>;
            case EDIT_ROLE:
                return <EditRole roles={roles} role={selectedRole}
                                 onClose={onClose}
                                 onDelete={this.deleteRole}
                                 onSave={this.saveRole}/>;
            case EDIT_USER:
                return <EditUser roles={roles}
                                 user={selectedUser}
                                 onClose={onClose}
                                 onDelete={this.deleteUser}
                                 onSave={this.saveUser}/>;
            case EDIT_RESOURCE:
            case EDIT_POLICY:
                return <EditPolicy policy={selectedPolicy} onClose={onClose} onUpdate={this.handleUpdatePolicy}/>;
            default:
                return null;
        }
        return null;
    };

    render() {
        const {classes} = this.props;
        const {addAnchor, currentView} = this;

        const modal = this.getModal(this.currentModal, this.props.store);
        const treeProps = this.getTreeProps();
        const tableProps = this.getTableProps();
        return (
            <div className="App">
                {modal}
                <Button aria-owns={addAnchor ? 'add-menu' : null}
                        aria-haspopup="true"
                        variant="fab"
                        className={classes.addIcon}
                        onClick={(evt) => this.addAnchor = evt.currentTarget}
                        color="primary">
                    <AddIcon/>
                </Button>
                <Menu id="add-menu"
                      getContentAnchorEl={null}
                      anchorEl={addAnchor}
                      open={Boolean(addAnchor)}
                      anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',

                      }}
                      transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                      }}
                      onClose={() => this.addAnchor = null}>
                    <Perm permissions={[Policies.admin()]}><MenuItem
                        onClick={this.handleCreateRole}><GroupAdd/> Add role</MenuItem></Perm>
                    <Perm permissions={Policies.admin()}><MenuItem
                        onClick={this.handleCreateUser}><PersonAdd/> Add user</MenuItem></Perm>
                </Menu>

                <Grid container className={classes.root}>
                    <Grid item xs={12}>
                        <Grid container spacing={8} alignItems="stretch" justify="center" direction="row"
                              style={{height: 'calc(100vh - 90px)'}}>
                            <Grid item md={4} sm={5}>
                                <Card style={{height: "100%"}}>
                                    <CardContent>
                                        <Tree selected={treeProps.selected}
                                              selectedView={currentView}
                                              views={[VIEWS.RESOURCES, VIEWS.ROLES, VIEWS.USERS]}
                                              onChangeView={this.changeView}
                                              title={treeProps.title}
                                              isLoading={treeProps.isLoading}
                                              nodes={treeProps.nodes}
                                              options={treeProps.options}/>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item md={8} sm={7}>
                                <Card style={{height: "100%"}}>
                                    <CardHeader title={treeProps && treeProps.selected && treeProps.selected.name}
                                                subheader={treeProps.subHeader}
                                    />
                                    <CardActions className={classes.actions}>
                                        {treeProps && treeProps.actions}
                                    </CardActions>

                                    <CardContent>
                                        <TableOverview
                                            isLoading={tableProps.isLoading}
                                            title={tableProps.title}
                                            selected={tableProps.selected}
                                            permissions={tableProps.permissions}
                                            list={tableProps.list}
                                            rowOptions={tableProps.rowOptions}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
            ;
    }
}

export default withStyles(styles)(observer(Management));

Management.propTypes = {
    store: PropTypes.instanceOf(ResourceStore),
    classes: PropTypes.object.isRequired
}

decorate(Management, {
    handleEditRole: action,
    handleCreateUser: action,
    handleCreateRole: action,
    handleEditPolicy: action,
    handleEditUser: action,
    selectedTab: observable,
    currentView: observable,
    currentModal: observable,
    selectedUser: observable,
    selectedRole: observable,
    selectedPolicy: observable,
    addAnchor: observable
})
