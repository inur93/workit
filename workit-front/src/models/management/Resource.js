import {observable, decorate} from 'mobx';

/*
created: 12-05-2018
created by: Runi
*/

export default class Resource {

    id;
    name;
    parentResource;
    subResources;
    activePermissions;
    secured;
    availablePermissions;

    constructor(json, parent) {
        Object.assign(this, json);
        this.parentResource = parent;
        this.subResources = (json.subResources || []).map(r => new Resource(r, this));
    }

    get json(){
        return {
            id: this.id,
            name: this.name,
            subResources: this.subResources.map(r => r.json),
            activePermissions: this.activePermissions
        }
    }
}
