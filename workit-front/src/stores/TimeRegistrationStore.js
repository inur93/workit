import {decorate, observable, computed, action} from 'mobx';
import agent from "../agent";

/*
created: 18-09-2018
created by: Runi
*/

export default class TimeRegistrationStore {

    timeRegistrations = [];
    from = 0;
    to = 0;

    isLoading = false;
    hasError = false;
    error = "";

    constructor() {
        let now = new Date();
        let today = new Date(`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`);
        this.from = new Date(today.getTime() - (1000*60*60*24*today.getDay())).getTime();
        this.to = new Date(today.getTime() + (1000*60*60*24*(7-today.getDay()))).getTime();
    }

    fetchTimeRegistrations = () => {
        this.isLoading = true;
        agent.Users.getTimeRegistrations(this.from, this.to)
            .then(list => this.timeRegistrations = list)
            .catch(this.handleError)
            .finally(() => this.isLoading = false);
    }

    handleError = (err) => {
        if(err.status === 403){
            this.hasError = true;
            this.error = err.message;
        }
    }
}

decorate(TimeRegistrationStore, {
    timeRegistrations: observable,
    from: observable,
    to: observable,
    isLoading: observable,
    hasError: observable,
    error: observable,

    fetchTimeRegistrations: action,
    handleError: action
});
