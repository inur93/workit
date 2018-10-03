import {decorate, autorun, computed, observer, reaction, action, observable} from 'mobx';

/*
created: 04-07-2018
created by: Runi
*/

export default class Item {

    id = null;
    title = "";
    values = {};

    constructor(json) {
        this.id = json.id;
        this.title = json.title;
        this.values = observable.map(json.values || {});
    }

    get json() {
        return {
            id: this.id,
            title: this.title,
            values: this.values.toJSON()
        }
    }
}

decorate(Item, {
    titles: observable,
    values: observable,
    json: computed
});
