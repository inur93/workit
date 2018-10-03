import {decorate, observable, computed, action} from 'mobx';

/*
created: 26-09-2018
created by: Runi
*/

class ToastStore {

    variant = "info";
    message = "";
    show = false;

    options = null;

    constructor() {
    }

    info = (msg, options) => {
        this.variant = "info";
        this.showMsg(msg, options);
    };

    error = (msg, options) => {
        this.variant = "error";
        this.showMsg(msg, options);
    };

    warning = (msg, options) => {
        this.variant = "warning";
        this.showMsg(msg, options);
    };

    success = (msg, options) => {
        this.variant = "success";
        this.showMsg(msg, options);
    };

    showMsg = (msg, options) => {
        this.show = true;
        this.message = msg;
    };

    onClose = (event, reason) => {
        if (reason === "timeout")
            this.show = false;
    }
}

decorate(ToastStore, {
    variant: observable,
    message: observable,
    show: observable,

    info: action,
    error: action,
    warning: action,
    success: action,
    showMsg: action
});

export default (new ToastStore());




