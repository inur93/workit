
export const Policies = {
    admin: () => `admin:admin`,
    developer: () => 'developer:developer',
    clientRead: (id) => `${id} client:read`,
    clientUpdate: (id) => `${id} client:update`,
    projectCreate: (id) => `${id} project:create`,
    projectRead: (id) => `${id} project:read`,
    projectUpdate: (id) => `${id} project:update`,
    projectDeveloper: (pId) => `${pId} project:developer`,
    casesCreate: (pid) => `${pid} cases:create`,
    casesUpdate: (pid) => `${pid} cases:update`
};