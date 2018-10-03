import {decorate, autorun, computed, observer, reaction, action, observable} from 'mobx';

/*
created: 04-07-2018
created by: Runi
*/

export default class Field {

    id = null;
    tempId = null;
    name = "";
    defaultValue = "";
    group = "";
    source = "";
    regex = "";
    order = 0;

    constructor(json) {
        this.id = json.id;
        this.tempId = json.tempId;
        this.name = json.name;
        this.defaultValue = json.defaultValue;
        this.group = json.group;
        this.order = json.order || 0;
        this.regex = json.regex;
    }

    get json() {
        return {
            id: this.id,
            name: this.name,
            defaultValue: this.defaultValue,
            group: this.group,
            source: this.source,
            order: this.order
        }
    }
}

decorate(Field, {
    tempId: observable,
    name: observable,
    group: observable,
    defaultValue: observable,
    order: observable,
    source: observable,
    regex: observable,
    json: computed
});
