import {computed, decorate, observable} from 'mobx';
import Policy from "./Policy";

/*
created: 03-05-2018
created by: Runi
*/

export default class Role {

    id;
    name;

    policyIds;
    parent;
    children = [];

    store;

    constructor(json, store) {
        const {id, name, parent} = json;
        this.id = id;
        this.name = name;
        this.parent = parent;
        this.store = store;
        (json.policies || []).forEach(p => store.policies.push(new Policy(p, store)));
        this.policyIds = (json.policies||[]).map(p => p.id);
        this.children = [];
    }

    get policies (){
        return this.store.policies.filter(p => !!this.policyIds.find(id => id === p.id)) || [];
    }

    /**
     * 1. check if this role has been given access to the given resource
     * 2. check if this role has been given access to the given resource via a parent resource
     * 3. check if the parent role has been given access to the given resource
     * @param resource
     * @param permission
     * @returns {*}
     * 1. true if access is given by this role for the given resource and permission
     * 2. {resource name} if the policy for the given resource inherits from a parent resource policy
     * 3. {permission name} if the access is granted via an admin permission (permission might be marked admin which makes them work as a shortcut to mark all permissions)
     * 4. {role name} if the access is given by a parent role
     */
    hasPermission = (resource, permission) => {
        if(!resource) return false;
        //get the policy for this role and for the current resource
        let policy = this.policies.find(p => p.resource.name === resource.name);

        // #1
        // if this role has access - return true - this is done before inheritence is checked
        // in case of the permission has been granted on this resource before any parent had been given access to given resource
        if(policy && policy.allowed.get(permission.id)) return true;

        // #2
        if (policy &&
            policy.inheritsFromParent &&
            resource.parentResource &&
            this.hasPermission(resource.parentResource, permission)) {
            return resource.parentResource.name;
        }

        // #3
        if((this.parent && this.parent.hasPermission(resource, permission))){
            return this.parent.name;
        }

        // #4
        //get the alternate admin permission if this exists in store
        const adminPermission = this.store.permissions.find(p => p.admin);
        if (adminPermission) {
            //if the admin permission is granted on current resource -
            // all other permission including requested permission is also granted
            // therefore the name of the admin permission is returned to indicate that access is granted
            // indirectly
            if(policy && policy.allowed.get(adminPermission.id)){
                return (adminPermission.id === permission.id) ? true : `${adminPermission.name}`;
            }
        }

        return false;
    }

    isParent = (role) => {
        return this.id === role.id || (this.parent && this.parent.isParent(role));
    }

    get json(){
        return {
            id: this.id,
            name: this.name,
            policies: this.policies.map(p => p.json),
            parent: this.parent && this.parent.json
        }
    }

    set json(json){
        this.name = json.name;
        this.id = json.id;
    }

}

decorate(Role, {
    name: observable,
    policies: computed,
    policyIds: observable,
    parent: observable,
    children: observable
})
