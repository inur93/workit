import {action, decorate, observable, reaction, runInAction} from 'mobx';
import agent from "../agent";

/*
created: 04-09-2018
created by: Runi
*/

export default class CaseStore {

    currentCase;
    cases = [];
    hasError = false;
    error = "";
    isLoading = false;

    home = {
        isLoading: false,
        cases: [],
        paging: {
            page: 0,
            pageSize: 10,
            orderBy: "_id",
            order: "asc",
            count: 0,
        }
    };

    project = {
        isLoading: false,
        cases: [],
        paging: {
            page: 0,
            pageSize: 10,
            orderBy: "_id",
            order: "asc",
            count: 0,
        }
    };

    clientStore = null;
    projectStore = null;

    constructor(registry) {

        this.clientStore = registry.ClientStore;
        this.projectStore = registry.ProjectStore;

        reaction(() => ({
            page: this.home.paging.page,
            pageSize: this.home.paging.pageSize,
            orderBy: this.home.paging.orderBy,
            order: this.home.paging.order,
        }), paging => {
            const {page, pageSize, orderBy, order} = paging;
            this.reloadHomeCases(page, pageSize, orderBy, order);
        });
        reaction(() => ({
            page: this.project.paging.page,
            pageSize: this.project.paging.pageSize,
            orderBy: this.project.paging.orderBy,
            order: this.project.paging.order,
        }), paging => {
            const {page, pageSize, orderBy, order} = paging;
            //TODO wait for ProjectStore have loaded
            if (!this.projectStore.currentProject) return;
            this.reloadProjectCases(this.projectStore.currentProject.id, page, pageSize, orderBy, order);
        });
    }

    createCase = (projectId, newCase) => {
        return agent.Cases.createCase(projectId, newCase);
    };

    reloadHomeCases = (page = this.home.paging.page,
                       pageSize = this.home.paging.pageSize,
                       orderBy = this.home.paging.orderBy,
                       order = this.home.paging.order) => {
        this.home.isLoading = true;
        agent.Users.getCases("", page, pageSize, orderBy, order)
            .then(action((listWithTotal) => {
                this.home.cases = listWithTotal.list;
                this.home.paging.count = listWithTotal.count;
            }))
            .catch(err => {
                //TODO toast
            })
            .finally(() => this.home.isLoading = false);
    };

    reloadProjectCases = (projectId = this.projectStore.currentProject.id,
                          page = this.project.paging.page,
                          pageSize = this.project.paging.pageSize,
                          orderBy = this.project.paging.orderBy,
                          order = this.project.paging.order) => {
        this.project.isLoading = true;
        agent.Cases.fetchCases(projectId,
            page, pageSize, orderBy, order)
            .then(action((listWithTotal) => {
                this.project.cases = listWithTotal.list;
                this.project.paging.count = listWithTotal.count;
            }))
            .finally(() => this.project.isLoading = false);
    };

    getCase = (projectId, caseId) => {
        //if (this.currentCase && this.currentCase.id === caseId) return Promise.resolve(this.currentCase);
        this.isLoading = true;
        return agent.Cases.getCase(projectId, caseId)
            .then(aCase => {
                runInAction(() => {
                    aCase.newComment = {
                        text: ""
                    };
                    this.currentCase = aCase;
                });
                return aCase;
            })
            .catch(this.handleError)
            .finally(() => this.isLoading = false)
    };

    updateCase = (projectId, caseId, aCase) => {
        return agent.Cases.updateCase(projectId, caseId, aCase)
            .then(updated => {
                if (this.currentCase && updated.id === this.currentCase.id) {
                    this.currentCase = updated;
                }

                this.project.cases.splice(
                    this.project.cases.indexOf(
                        this.project.cases.find(c => c.id === updated.id)), 1, updated);
                this.home.cases.splice(
                    this.home.cases.indexOf(
                        this.home.cases.find(c => c.id === updated.id)), 1, updated);
                return updated;
            })
    };

    registerTime = (projectId, caseId, registration) => {
        return agent.Clients.registerTime(projectId, caseId, registration);
    }

    handleError = err => {
        if(!err) err = {};
        if(!err.message){
            err.message = "Unknown error";
        }
        this.error = err.message;
        this.hasError = true;
        throw err;
    }
}

decorate(CaseStore, {
    currentCase: observable,
    isLoading: observable,

    home: observable,

    project: observable,
    cases: observable,
    newCase: observable,
    paging: observable,

    hasError: observable,
    error: observable,
    handleError: action
});
