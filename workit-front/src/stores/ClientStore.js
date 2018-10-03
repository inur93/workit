import {decorate, observable, computed, action, transaction, reaction, autorun} from 'mobx';
import agent from "../agent";

/*
created: 03-09-2018
created by: Runi
*/

export default class ClientStore {

    status = {
        currentClient: {
            isLoading: false,
            hasError: false,
            error: ""
        },
        clientList: {
            isLoading: false,
            hasError: false,
            error: ""
        },
        createClient: {
            isLoading: false,
            hasError: false,
            error: ""
        },
        updateClient: {
            isLoading: false,
            hasError: false,
            error: ""
        }
    };

    currentClient;
    currentClientUsers = [];
    paging = {
        page: 0,
        pageSize: 10,
        orderBy: "_id",
        order: "asc",
        count: 0,
    };
    clients = [];

    pagingHandler = null;

    constructor() {
        reaction(() => ({
            page: this.paging.page,
            pageSize: this.paging.pageSize,
            orderBy: this.paging.orderBy,
            order: this.paging.order
        }), paging => {
            const {page, pageSize, orderBy, order} = paging;
            this.reloadClients(page, pageSize, orderBy, order);
        });
    }

    reloadClients = (page = this.paging.page,
                     pageSize = this.paging.pageSize,
                     orderBy = this.paging.orderBy,
                     order = this.paging.order) => {
        this.doLoad(this.status.clientList);
        return agent.Clients.getAll(page, pageSize, orderBy, order)
            .then(listWithTotal => {
                transaction(() => {
                    this.paging.count = listWithTotal.count;
                    this.clients = listWithTotal.list;
                })
            })
            .catch(err => this.handleError(err, this.status.clientList))
            .finally(() => this.status.clientList.isLoading = false);
    };

    createClient = (client) => {
        this.doLoad(this.status.createClient);
        return agent.Clients.createClient(client)
            .catch(err => this.handleError(err, this.status.createClient))
            .finally(() => this.status.createClient.isLoading = false);
    };

    updateClient = (client) => {
        this.doLoad(this.status.updateClient);
        return agent.Clients.updateClient(client)
            .catch(err => this.handleError(err, this.status.updateClient))
            .finally(() => this.status.updateClient.isLoading = false);
    }

    fetchClient = (clientId) => {
        this.doLoad(this.status.currentClient);
        return agent.Clients.fetchClient(clientId)
            .then(client => this.currentClient = client)
            .catch(err => this.handleError(err, this.status.currentClient))
            .finally(() => this.status.currentClient.isLoading = false);
    };

    fetchCurrentClientUsers = (clientId) => {
        this.doLoad(this.status.currentClient);
        return agent.Clients.getUsers(clientId)
            .then(users => this.currentClientUsers = users)
            .catch(err => this.handleError(err, this.status.currentClient))
            .finally(() => this.status.currentClient.isLoading = false);
    };

    queryClientUsers = (clientId, query, group) => {
        if(!clientId) return Promise.resolve([]);
        return agent.Clients.getUsers(clientId, query, group)
            .then(users => {
                const keys = Object.keys(users);
                let list = [];
                keys.forEach(key => {
                    users[key].forEach(u => list.push(u));
                });
                return list;
            });
    }

    doLoad = (statusObj) => {
        statusObj.isLoading = true;
        statusObj.hasError = false;
    }

    handleError = (err, statusObj) => {
        if (err.status === 403) {
            statusObj.hasError = true;
            statusObj.error = err.message;
        }
        throw err;
    }

}

decorate(ClientStore, {
    isCreating: observable,
    currentClient: observable,
    currentClientUsers: observable,
    clients: observable,
    paging: observable,

    status: observable,

    handleError: action,
    doLoad: action
});
