import {decorate, observable, reaction, action, autorun, transaction, computed} from 'mobx'
import TokenStore from "./TokenStore";
import agent from "../agent";

export default class UserStore {
    self = null;
    policies = [];
    users = [];
    userSuggestions = [];
    currentUser = null;

    isLoading = false;
    isCreating = false;
    isUpdating = false;

    newUser = {
        name: "",
        email: "",
        password: "",
    };
    paging = {
        page: 0,
        pageSize: 10,
        count: 0,
    };

    constructor() {
        autorun(() => {
            if (TokenStore.token) {
                this.fetchSelf(TokenStore.user);
            }
        })
    }

    createUser = () => {
        this.isCreating = true;
        return agent.Users.create(this.newUser)
            .then(created => {

                return created;
            })
            .catch(e => {
                throw e; //TODO
            })
            .finally(() => this.isCreating = false);
    };

    getUserSuggestions = (query) => {
        return agent.Users.getAll(0, 20, query)
            .then(listWithTotal => {
                transaction(() => {
                    this.userSuggestions = listWithTotal.total;
                    this.paging.count = listWithTotal.count;
                });
                return listWithTotal.list;
            })
    };

    fetchSelf = (user) => {
        if (user) {
            agent.Users.getSelf()
                .then(user => {
                    transaction(() => {
                        this.self = user;
                        this.policies = user.policies;
                    })
                })
        }
    };

    hasAccess = (permission) => {
        if (!this.policies || !permission) return false;
        const res = (this.policies || []).filter(p =>
            p.resources.includes(permission.resource)
            && p.permissions.includes(permission.permission));
        if (res.length > 0) return true;
    };

    getUsersForProject = (projectId, query) => {
        return agent.Users.getUsersByProject(projectId, query);
    };

    updateSelf = (user) => {
        this.isUpdating = true;
        return agent.Users.updateSelf(user)
            .then(updated => {
               this.self = updated;
            })
            .finally(() => this.isUpdating = false);
    };

    updateSelfPassword = (user) => {
        return agent.Users.updateSelfPassword(user);
    }
}

decorate(UserStore, {
    self: observable,
    policies: observable,
    users: observable,
    userSuggestions: observable,
    paging: observable,
    currentUser: observable,
    newUser: observable,

    isCreating: observable,
    isLoading: observable,
    isUpdating: observable,

    updateSelf: action
});
