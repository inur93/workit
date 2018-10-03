import {computed, decorate, observable, action, runInAction, reaction} from 'mobx';
import Role from "../models/management/Role";
import Policy from "../models/management/Policy";
import Resource from "../models/management/Resource";
import User from "../models/management/User";

/*
created: 30-04-2018
created by: Runi
*/

export default class ManagementStore {

    currentResource = null;
    currentRole = null;
    currentUser = null;

    isResourcesLoading = true;
    isRolesLoading = true;
    isUsersLoading = true;

    resources = [];
    permissions = [];
    roles = [];
    users = [];
    policies = [];
    transportLayer;

    loaded = false;

    constructor(transportLayer) {
        this.transportLayer = transportLayer;

        reaction(() => this.currentResource, resource => {
            if (resource) localStorage.setItem('currentResource', resource.id);
        });
        reaction(() => this.currentRole, role => {
            if (role) localStorage.setItem('currentRole', role.id);
        });
        reaction(() => this.currentUser, user => {
            if (user) localStorage.setItem('currentUser', user.id);
        });
    }

    get isLoaded() {
        return this.loaded;
    }

    load = () => {
        this.loaded = true;
        this.transportLayer.fetchUsers().then(this.handleUsersLoaded);
        this.transportLayer.fetchRoles().then(this.handleRolesLoaded);

        this.transportLayer.fetchPermissions().then(json => {
            this.permissions = json;
        });
        this.transportLayer.fetchResources().then(this.handleResourcesLoaded);
    }

    searchUsers = (query) => {
        return this.transportLayer.searchUsers(query);
    };

    createRole = (role) => {
        return this.transportLayer.createRole(role).then(this.handleNewRole);
    };

    createUser = (user) => {
        return this.transportLayer
            .createUser(user)
            .then(this.handleNewUser);
    };


    updateRole = (role) => {
        let existing = this.roles.find(r => r.id === role.id);
        let json = existing.json;
        json.name = role.name;
        json.parent = role.parent && role.parent.json;
        return this.transportLayer.updateRole(json).then(this.handleUpdatedRole)
            .catch(err => console.log(err)); // error is handled in agent
    };

    updateUser = (user) => {
        let existing = this.users.find(u => u.id === user.id);
        let json = existing.json;
        json.name = user.name;
        json.roles = user.roles.map(r => r.json);
        return this.transportLayer.updateUser(json).then(this.handleUpdatedUser)
            .catch(err => console.log(err)); // error is handled in agent
    };

    createPolicyForUser = (user, policy) => {
        return this.transportLayer.createPolicyForUser(user.id, policy.json)
            .then(created => this.handleNewPolicyForUser(created, user))
            .catch(err => console.log(err)); // error is handled in agent
    };

    createPolicyForRole = (role, policy) => {
        return this.transportLayer.createPolicyForRole(role.id, policy.json)
            .then(created => this.handleNewPolicyForRole(created, role))
            .catch(err => console.log(err)); // error is handled in agent
    };

    updatePolicy = (policy) => {
        return this.transportLayer.updatePolicy(policy.id, policy.json)
            .then(updated => {
                runInAction(() => {
                    this.policies.splice(
                        this.policies.indexOf(
                            this.policies.find(p => p.id === updated.id)), 1);
                    this.policies.push(new Policy(updated, this));
                });
            })
            .catch(err => console.log(err)); // error is handled in agent
    };

    deleteRole = (role) => {
        return this.transportLayer.deleteRole(role.id)
            .then(() => this.handleDeletedRole(role))
            .catch(err => {
                throw err;
            });
    }

    deleteUser = (user) => {
        return this.transportLayer.deleteUser(user.id)
            .then(() => this.handleDeletedUser(user))
            .catch(err => {
                throw err;
            })
    };

    get resourcesFlat() {
        let list = [];
        let iterator = (resource) => {
            if (!list.find(r => r.id === resource.id)) {
                list.push(resource);
            }
            if (resource.subResources) {
                resource.subResources.forEach(s => iterator(s));
            }
        }
        this.resources.forEach(r => iterator(r));
        return list;
    }

    get roleTree() {
        let root = this.roles.filter(r => !r.parent);
        return root;
    }

    updatePermission = (role, resourceName, permission, allowed) => {
        this.updatePolicy(role, resourceName, permission.id, allowed);
    };

    updatePermissionForUser = (user, resourceName, permission, allowed) => {
        this.updatePolicy(user, resourceName, permission.id, allowed);
    };

    /*############################
        ACTIONS
     #############################*/

    handleResourcesLoaded = (json) => {
        json = json.sort((a, b) => a.name > b.name);
        json.forEach(resource => {
            resource.subResources = resource.subResources
                .sort((a, b) => a.name > b.name);
        })
        const resources = json.map(r => new Resource(r));
        //set default value
        if (!this.currentResource && resources && resources.length > 0) {
            let list = [];
            let iterator = (resource) => {
                if (!list.find(r => r.id === resource.id)) {
                    list.push(resource);
                }
                if (resource.subResources) {
                    resource.subResources.forEach(s => iterator(s));
                }
            }
            resources.forEach(r => iterator(r));
            this.currentResource = list.find(r => r.id === (localStorage.getItem('currentResource') || resources[0].id)) || resources[0];
        }
        this.resources = resources;

        this.isResourcesLoading = false;
        return resources;
    };

    handleRolesLoaded = (json) => {
        let roles = json.map(role => new Role(role, this));
        roles.forEach(r => {
            if (r.parent) {
                let parent = roles.find(p => p.id === r.parent.id);
                parent.children.push(r);
                r.parent = parent;
            }
        });

        if (!this.currentRole && roles && roles.length > 0)
            this.currentRole = roles.find(r => r.id === (localStorage.getItem('currentRole') || roles[0].id)); //set default value
        this.roles = roles;
        this.isRolesLoading = false;
    };

    handleUsersLoaded = (json) => {
        const users = json.map(user => new User(user, this));
        if (!this.currentUser && users && users.length > 0)
            this.currentUser = users.find(u => u.id === (localStorage.getItem('currentUser') || users[0].id));
        this.users = users;
        this.isUsersLoading = false;
    };

    /* action to be executed after role has been created */
    handleNewRole = (created) => {
        if (!created) return; //failed to create - return - error is handled elsewhere
        const n = new Role(created, this);
        if (n.parent) {
            let parent = this.roles.find(r => r.id === n.parent.id);
            parent.children.push(n);
            n.parent = parent;
        }
        this.roles.push(n);
    };

    /*action to be executed after user has been created*/
    handleNewUser = (created) => {
        let u = new User(created, this);
        this.users.push(u);
        if (u.roles) {
            let existingRoles = [];
            u.roles.forEach(role => {
                existingRoles.push(this.roles.find(e => e.id === role.id));
            });
            u.roles = existingRoles;
        }
    };

    handleNewPolicyForUser = (policy, user) => {
        const created = new Policy(policy, this);
        this.policies.push(created);
        user.policyIds.push(created.id);
    };

    handleNewPolicyForRole = (policy, role) => {
        const created = new Policy(policy, this);
        this.policies.push(created);
        role.policyIds.push(created.id);
    };

    handleUpdatedRole = (updated) => {
        let existing = this.roles.find(r => r.id === updated.id);
        if (existing.parent) {
            existing.parent.children.splice(existing.parent.children.indexOf(existing), 1);
            existing.parent = null;
        }
        if (updated.parent) {
            let parent = this.roles.find(r => r.id === updated.parent.id);
            parent.children.push(existing);
            existing.parent = parent;
        }
        existing.name = updated.name;
    };

    handleUpdatedUser = (updated) => {
        let existing = this.users.find(u => u.id === updated.id);
        existing.json = updated;
    };

    handleDeletedUser = (user) => {
        this.users.splice(this.users.indexOf(user), 1);
        if (this.currentUser) {
            if (this.currentUser.id === user.id && this.users.length > 0) {
                this.currentUser = this.users[0];
            }
        }
    };

    handleDeletedRole = (role) => {
        if (role.parent) {
            role.parent.children.splice(role.parent.children.indexOf(role), 1);
        }
        this.roles.splice(this.roles.indexOf(role), 1);
    }
}

decorate(ManagementStore, {
    currentResource: observable,
    currentRole: observable,
    currentUser: observable,

    isResourcesLoading: observable,
    isRolesLoading: observable,
    isUsersLoading: observable,
    /*permissionValues: computed,*/
    roleTree: computed,
    resources: observable,
    permissions: observable,
    roles: observable,
    users: observable,
    policies: observable,

    handleUsersLoaded: action,
    handleRolesLoaded: action,
    handleResourcesLoaded: action,

    handleNewUser: action,
    handleNewRole: action,
    handleNewPolicyForUser: action,
    handleNewPolicyForRole: action,
    handleUpdatedRole: action,
    handleUpdatedUser: action,
    handleDeletedUser: action,
    handleDeletedRole: action,
    updatePermission: action,
    toggleRow: action,
    updatePolicy: action,
    processResources: action,
});