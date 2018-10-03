import {decorate, observable, computed, action} from 'mobx';
import agent from "../agent";

/*
created: 03-09-2018
created by: Runi
*/

export default class ProjectStore {

    currentProject = null;
    currentProjectUsers = {};
    projects = [];
    isLoading = false;
    isCreating = false;
    isUpdating = false;
    currentUserProjects = [];

    hasError = false;
    hasCreateError = false;
    hasUpdateError = false;

    error = false;
    createError = false;
    updateError = false;

    constructor() {
    }

    updateProject = (project) => {
        this.isUpdating = true;
        this.hasUpdateError = false;
        return agent.Projects.updateProject(project)
            .then(updated => {
                if(this.currentProject && updated.id === this.currentProject.id){
                    this.currentProject = updated;
                }
                return updated;
            })
            .catch(this.handleUpdateError)
            .finally(() => this.isUpdating = false);
    };

    createProject = (clientId, project) => {
        this.isCreating = true;
        this.hasCreateError = false;
        return agent.Projects.createProject(clientId, project)
            .catch(this.handleCreateError)
            .finally(() => this.isCreating = false)
    };

    fetchProject = (projectId) => {
        this.isLoading = true;
        this.hasError = false;
        return agent.Projects.fetchProject(projectId)
            .then(current => this.currentProject = current)
            .catch(this.handleError)
            .finally(() => this.isLoading = false);
    };

    queryProjectUsers = (projectId, query, group = "all") => {
        return agent.Projects.getUsers(projectId, query, group)
            .then(users => {
                const keys = Object.keys(users);
                let list = [];
                keys.forEach(key => {
                    users[key].forEach(u => list.push(u));
                });
                return list;
            })
            .catch(err => this.handleError(err));
    };
    fetchCurrentProjectUsers = (projectId) => {
        if (!projectId) return Promise.resolve([]);
        this.isLoading = true;
        return agent.Projects.getUsers(projectId)
            .then(users => this.currentProjectUsers = users)
            .catch(err => this.handleError(err))
            .finally(() => this.isLoading = false);
    };

    getAll = () => {
        this.isLoading = true;
        this.hasError = false;
        return agent.Projects.getAll()
            .then(projects => this.projects = projects)
            .catch(this.handleError)
            .finally(() => this.isLoading = false);
    };

    getByClientId = (clientId) => {
        this.isLoading = true;
        this.hasError = false;
        return agent.Projects.getByClientId(clientId)
            .then(listWithTotal => this.projects = listWithTotal.list)
            .catch(this.handleError)
            .finally(() => this.isLoading = false);
    }

    getProjectsForSelf = () => {
        this.isLoading = true;
        this.hasError = false;
        return agent.Users.getProjects()
            .then(listWithTotal => {
                this.currentUserProjects = listWithTotal.list || [];
                return listWithTotal || 0;
            })
            .catch(this.handleError)
            .finally(() => this.isLoading = false);
    }

    handleError = err => {
        if (err) {
            this.error = err.message;
        }
        else{
            err = {message: "An unknown error occurred. Try again"}
        }
        this.hasError = true;
        throw err;
    };

    handleCreateError = err => {
        if (err) {
            this.createError = err.message;
        }else{
            err = {message: "An unknown error occurred. Try again"}
        }
        this.hasCreateError = true;
        throw err;
    }

    handleUpdateError = err => {
        if(err){
            this.updateError = err.message;
        }else{
            err = {message: "An unknown error occurred. Try again"};
        }
        this.hasUpdateError = true;
        throw err;
    }
}

decorate(ProjectStore, {
    currentProject: observable,
    currentProjectUsers: observable,
    projects: observable,
    currentUserProjects: observable,
    isLoading: observable,
    isCreating: observable,
    isUpdating: observable,

    hasError: observable,
    hasCreateError: observable,
    hasUpdateError: observable,
    error: observable,
    createError: observable,
    updateError: observable,

    handleError: action,
    handleCreateError: action,
    handleUpdateError: action,

    getProjectsForSelf: action,
    getByClientId: action,
    getAll: action,
    fetchProject: action,
    createProject: action,
    saveProject: action
});
