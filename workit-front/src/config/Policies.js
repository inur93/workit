//resource regular expression
const Resources = {
    auth: () => "^authentication$",
    authLogin: () => "^authentication/login$",
    authResetpassword: () => "^authentication/resetpassword$",
    cases: () => "^cases$",
    clients: () => "^clients$",
    clientsId: (id) => `^clients/\\*|${id}$`,
    clientsIdProjects: id => `^clients/\\*|${id}$`,
    clientsIdUsers: id => `^clients/\\*|${id}$`,
    fields: () => `^fields$`,
    fieldsLangs: () => `^fields/langs$`,
    mgm: () => `^management$`,
    mgmUser: () => `^management/users$`,
    mgmUsersSelfTimeReg: () => `^management/users/self/timeregistrations$`,
    mgmRoles: () => "^management/roles$",
    mgmResources: () => "^management/resources$",
    projectDeveloper: id => `^projects/\\*|${id}/developer$`,
    projects: () => "^projects$",
    projectsId: id => `^projects/\\*|${id}$`,
    projectsIdCases: id => `^projects/\\*|${id}/cases$`,
    projectsIdCasesId: (id, cid) => `^projects/\\*|${id}/cases/\\*|${cid}$`,
    projectsIdCasesIdTimeReg: (id, cid) => `^projects/\\*|${id}/cases/\\*|${cid}/timeregistration$`,
    projectsIdCasesTimeReg: id => `^projects/\\*|${id}/cases$`,

};


const Permissions = {
    create: "Create",
    read: "READ",
    update: "UPDATE",
    deletePerm: "DELETE",
    admin: "ADMIN",
    timeRegistration: "timeRegistration"
};

const buildPolicy = (resource, permissions) => {
    return {
        resource: resource,
        permissions: permissions
    }
};

export const Policies = {
    fieldsAdmin: () => buildPolicy(Resources.fields(), [Permissions.admin]),
    mgmAdmin: () => buildPolicy(Resources.mgm(), [Permissions.admin]),
    mgmResourcesAdmin: () => buildPolicy(Resources.mgmResources(), [Permissions.admin]),
    mgmRolesCreate: () => buildPolicy(Resources.mgmRoles(), [Permissions.create]),
    mgmRolesUpdate: () => buildPolicy(Resources.mgmRoles(), [Permissions.update]),
    mgmRolesDelete: () => buildPolicy(Resources.mgmRoles(), [Permissions.deletePerm]),
    mgmUsersCreate: () => buildPolicy(Resources.mgmUser(), [Permissions.create]),
    mgmUsersUpdate: () => buildPolicy(Resources.mgmUser(), [Permissions.update]),
    mgmUsersDelete: () => buildPolicy(Resources.mgmUser(), [Permissions.deletePerm]),
    mgmUsersSelfTimeRegRead: () => buildPolicy(Resources.mgmUsersSelfTimeReg(), [Permissions.read]),

    clientsRead: () => buildPolicy(Resources.clients(), [Permissions.read]),
    clientsCreate: () => buildPolicy(Resources.clients(), [Permissions.create]),
    clientsIdCreate: (id) => buildPolicy(Resources.clientsId(id), [Permissions.create]),
    clientsIdRead: id => buildPolicy(Resources.clientsId(id), [Permissions.read]),
    clientsIdAdmin: id => buildPolicy(Resources.clientsId(id), [Permissions.admin]),
    projectsIdRead: id => buildPolicy(Resources.projectsId(id), [Permissions.read]),
    projectsIdUpdate: (id) => buildPolicy(Resources.projectsId(id), [Permissions.update]),
    projectsIdAdmin: (id) => buildPolicy(Resources.projectsId(id), [Permissions.admin]),
    projectsIdCasesCreate: (id) => buildPolicy(Resources.projectsIdCases(id), [Permissions.create]),
    projectsIdCasesIdUpdate: (pid, cid) => buildPolicy(Resources.projectsIdCasesId(pid, cid), [Permissions.update]),
    projectsIdCasesIdTimeReg: (pid, cid) => buildPolicy(Resources.projectsIdCasesIdTimeReg(pid, cid), [Permissions.timeRegistration]),
    projectDeveloper: (pId, cid) => buildPolicy(Resources.projectsIdCasesIdTimeReg(pId, cid), [Permissions.timeRegistration]),
};