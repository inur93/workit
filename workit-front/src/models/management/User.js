import {computed, decorate, observable} from 'mobx';
import Policy from "./Policy";
import Role from "./Role";

/*
created: 14-05-2018
created by: Runi
*/

export default class User {

    id;
    username;
    roleIds = [];
    policyIds = [];

    store;

    constructor(json, store) {
        const {id, username, roles, policies} = json;
        this.id = id;
        this.username = username;
        this.store = store;

        (policies || []).forEach(p => store.policies.push(new Policy(p, store)));
        this.policyIds = (policies || []).map(p => p.id);
        this.roleIds = (roles || []).map(r => r.id);
    }

    get policies () {
        return this.store.policies.filter(p => !!this.policyIds.find(id => id === p.id));
    }

    hasPermission = (resource, permission) => {
        if (!resource) return false;
        // get the policy for this user and for the current resource
        let policy = this.policies.find(p => p.resource.name === resource.name);

        // #1
        if(policy && policy.allowed.get(permission.id)) return true;

        // #2
        if (policy &&
            policy.inheritsFromParent &&
            resource.parentResource &&
            this.hasPermission(resource.parentResource, permission)) {
            return resource.parentResource.name;
        }

        // #3
        const adminPermission = this.store.permissions.find(p => p.admin);
        if (adminPermission) {
            if(policy && policy.allowed.get(adminPermission.id)){
                return (adminPermission.id === permission.id) ? true : `${adminPermission.name}`;
            }
        }

        // #4
        return this.hasRolePermission(resource, permission);
    };

    hasRolePermission = (resource, permission) => {
        let granted = false;
        this.roles.forEach(r => {
            if (r.hasPermission(resource, permission)) {
                granted = r.name;
            }
        })
        return granted;
    }

    get roles() {
        return this.roleIds.map(id => this.store.roles.find(r => r.id === id) || new Role({id: id}, this.store)) || [];
    }

    set roles(roles) {
        this.roleIds = roles.map(r => r.id);
    }

    get json() {
        return {
            id: this.id,
            roles: this.roles.map(r => r.json),
            username: this.username,
            policies: this.policies.map(p => p.json)
        }
    }

    set json(json) {
        this.username = json.username;
        this.roleIds = (json.roles || []).map(r => r.id);
    }
}

decorate(User, {
    username: observable,
    roleIds: observable,
    policyIds: observable,
    policies: computed
})
