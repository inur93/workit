import {decorate, observable, computed} from 'mobx';
import Resource from "./Resource";

/*
created: 03-05-2018
created by: Runi
*/

export default class Policy {

    id;
    resourceId;

    inheritsFromParent;
    allowed;

    store;
    constructor(json, store) {
        const {id, resource, inheritsFromParent, allowed} = json;
        this.id = id;
        this.store = store;
        this.resourceId = resource.id;
        this.allowed = observable.map(allowed || {}, {deep: true});
        this.inheritsFromParent = !!inheritsFromParent;
    }

    get resource () {
        return this.store.resourcesFlat.find(r => r.id === this.resourceId);
    }

    get json(){
        return{
            id: this.id,
            resource: this.resource.json,
            inheritsFromParent: this.inheritsFromParent,
            allowed: this.allowed
        }
    }

}

decorate(Policy, {
    resource: computed,
    inheritsFromParent: observable,
    allowed: observable
})
