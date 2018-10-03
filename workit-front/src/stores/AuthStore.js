import {action, decorate, observable} from 'mobx';
import TokenStore from "./TokenStore";
import agent from "../agent";
import {error} from '../components/shared/Toast';


export default class AuthStore {

    policies = new observable.map({});

    login({username, password}) {
        return agent.Auth.login(username, password);
    }

    logout() {
        TokenStore.logout();
        return Promise.resolve();
    }
}

decorate(AuthStore, {});
