import {decorate, autorun, computed, observer, reaction, action, observable} from 'mobx';
import Field from "./Field";

/*
created: 04-07-2018
created by: Runi
*/

export default class ItemType {

    id = null;
    name = "";
    fields = [];

    groups = [];

    constructor(json) {
        this.id = json.id;
        this.name = json.name;
        this.fields = (json.fields || [])
            .map(field => new Field(field))
            .sort((a,b) => a.order - b.order);
        this.fields.forEach(field => {
            if(field.group && !this.groups.includes(field.group)){
                this.groups.push(field.group);
            }
        })
    }

    get fieldsWithNoGroup(){
        return this.fields.filter(field => !field.group).sort((a, b) => a.order - b.order);
    }
    get fieldsOnGroup(){
        const list = [];
        this.groups.forEach(group => {
            list.push({
                name: group,
                fields: this.fields.filter(f => f.group === group).sort((a, b) => a.order - b.order)
            })
        });
        return list;
    }

    get json() {
        return {
            id: this.id,
            name: this.name,
            fields: this.fields,
        }
    }
}

decorate(ItemType, {
    name: observable,
    groups: observable,
    fields: observable,
    fieldsOnGroup: computed,
    fieldsWithNoGroup: computed,
    json: computed
});
