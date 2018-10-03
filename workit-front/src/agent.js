import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import TokenStore from './stores/TokenStore';
import Config from './config/Config';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = Config.API_PATH;

// const encode = encodeURIComponent;

const handleErrors = err => {
    if (err) {
        if (err.response && err.response.body) throw err.response.body;
        if (err.status >= 500) throw ({status: err.status, message: "An unknown error occured try again"});
    }
    if (!err) return;

    debugger;
    throw ({status: 500, message: "The network or server is offline. Try to reload page."});
};

const responseBody = (res) => {
    if (res.headers && res.headers.authorization && res.headers.authorization.length > 0) {
        const token = res.headers.authorization.split(' ')[1];
        TokenStore.token = token;
    }
    return res.body
};

const tokenPlugin = req => {
    const Tok = TokenStore;

    if (TokenStore.token) {
        req.set('authorization', `Bearer ${TokenStore.token}`);
    }

    const r = req;
};

const requests = {
    del: url =>
        superagent
            .del(`${API_ROOT}${url}`)
            .use(tokenPlugin)
            .catch(handleErrors)
            .then(responseBody),
    get: url =>
        superagent
            .get(`${API_ROOT}${url}`)
            .use(tokenPlugin)
            .catch(handleErrors)
            .then(responseBody),
    put: (url, body) =>
        superagent
            .put(`${API_ROOT}${url}`, body)
            .use(tokenPlugin)
            .catch(handleErrors)
            .then(responseBody),
    post: (url, body) =>
        superagent
            .post(`${API_ROOT}${url}`, body)
            .use(tokenPlugin)
            .catch(handleErrors)
            .then(responseBody),
};

const Auth = {
    current: () =>
        requests.get('/user'),
    login: (username, password) =>
        requests.post('/authentication/login', {username: username, password: password}),

    // register: (username, email, password) =>
    //     requests.post('/users', { user: { username, email, password } }),
    // save: user =>
    //     requests.put('/user', { user })
};

const Management = {
    searchUsers: (query) =>
        requests.get(`/management/users/query?query=${query}&start=0&limit=20`),
    fetchUsers: () =>
        requests.get(`/management/users`),
    fetchRoles: () =>
        requests.get(`/management/roles`),
    fetchPermissions: () =>
        requests.get(`/management/permissions`),
    fetchResources: (update) =>
        requests.get(`/management/resources?update=${update}`),
    createRole: (role) =>
        requests.post(`/management/roles`, role),
    createUser: (user) =>
        requests.post(`/management/users`, user),
    createPolicyForRole: (roleId, policy) =>
        requests.post(`/management/roles/${roleId}/policies`, policy),
    createPolicyForUser: (userId, policy) =>
        requests.post(`/management/users/${userId}/policies`, policy),
    updateRole: (role) =>
        requests.put(`/management/roles/${role.id}`, role),
    updateUser: (user) =>
        requests.put(`/management/users/${user.id}`, user),
    updatePolicy: (policyId, policy) =>
        requests.put(`/management/policies/${policyId}`, policy),
    deleteRole: (roleId) =>
        requests.del(`/management/roles/${roleId}`),
    deleteUser: (userId) =>
        requests.del(`/management/users/${userId}`),
}

const Users = {
    getAll: (curPage, size, query) => {
        return superagent
            .get(`${API_ROOT}/management/users`)
            .use(tokenPlugin)
            .query({page: curPage})
            .query({size: size})
            .query({query: query})
            .end(handleErrors)
            .then(responseBody)
    },
    getTimeRegistrations: (from, to) =>
        requests.get(`/management/users/self/timeregistrations?from=${from}&to=${to}`),
    getSelf: () => {
        return requests.get(`/management/users/self`)
    },
    updateSelf: (user) => {
        return requests.put(`/management/users/self`, user);
    },
    updateSelfPassword: (user) => {
        return requests.put(`/management/users/self/resetpassword`, user);
    },
    save: (user) =>
        requests.put('/management/users', user)
    ,
    create: (user) =>
        requests.post('/management/users', user),
    delete: (id) => requests.del('/management/users' + id),
    getCases: (query, page, size, orderBy, order) =>
        requests.get(`/management/users/self/cases?query=${query || ""}&page=${page}&size=${size}&orderBy=${orderBy}&order=${order}`),
    getProjects: () =>
        requests.get(`/management/users/self/projects`),
    getUsersByProject: (projectId, query) =>
        requests.get(`/projects/${projectId}/users?query=${query || ""}`)
};

const Cms = {
    updateSimpleField: (field) => {
        return requests.put(`/fields/`, field);
    },
    getAllFields: (lang) => {
        return requests.get(`/fields?lang=${lang ? lang : ""}`);
    },
    getLanguages: () => {
        return requests.get(`/fields/langs`);
    }
};

const Clients = {
    createClient: (client) => {
        return requests.post(`/clients`, client);
    },
    updateClient: (client) => {
      return requests.put(`/clients/${client.id}`, client);
    },
    fetchClient: (clientId) => {
        return requests.get(`/clients/${clientId}`);
    },
    getAll: (page, size, orderBy, order) => {
        return requests.get(`/clients?page=${page}&size=${size}&orderBy=${orderBy}&order=${order}`);
    },
    registerTime: (projectId, caseId, registration) => {
        return requests.post(`/projects/${projectId}/cases/${caseId}/timeregistration`, registration);
    },
    getUsers: (clientId, query, group = "all") => {
        return requests.get(`/clients/${clientId}/users?query=${query || ""}&group=${group || ""}`);
    }
};

const Projects = {
    createProject: (clientId, project) => {
        return requests.post(`/clients/${clientId}/projects`, project);
    },
    fetchProject: (id) => {
        return requests.get(`/projects/${id}`);
    },
    getAll: () => {
        return requests.get(`/projects`);
    },
    updateProject: (project) => {
        return requests.put(`/projects/${project.id}`, project);
    },
    getByClientId: (clientId) => {
        return requests.get(`/clients/${clientId}/projects`);
    },
    getUsers: (projectId, query, group) => {
        return requests.get(`/projects/${projectId}/users?query=${query || ""}&group=${group || ""}`);
    }
};

const Cases = {
    createCase: (projectId, newCase) => {
        return requests.post(`/projects/${projectId}/cases`, newCase);
    },
    fetchCases: (projectId, page, pageSize, orderBy, order) => {
        return requests.get(`/projects/${projectId}/cases/?page=${page}&size=${pageSize}&orderBy=${orderBy}&order=${order}`);
    },
    getCase: (projectId, caseId) => {
        return requests.get(`/projects/${projectId}/cases/${caseId}`);
    },
    updateCase: (projectId, caseId, aCase) => {
        return requests.put(`/projects/${projectId}/cases/${caseId}`, aCase);
    }
}

export default {
    Auth, Users, Management, Cms, Clients, Projects, Cases
}