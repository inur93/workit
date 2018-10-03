import AuthStore from "./AuthStore";
import CaseStore from "./CaseStore";
import ClientStore from "./ClientStore";
import CmsStore from "./CmsStore";
import ManagementStore from "./ManagementStore";
import ProjectStore from "./ProjectStore";
import TokenStore from "./TokenStore";
import UserStore from "./UserStore";
import TimeRegistrationStore from "./TimeRegistrationStore";

class StoreRegistry {

    authStore;
    caseStore;
    clientStore;
    cmsStore;
    managementStore;
    projectStore;
    tokenStore;
    userStore;
    timeRegistrationStore;


    constructor() {
        this.projectStore = new ProjectStore();
        this.caseStore = new CaseStore(this);
        this.timeRegistrationStore = new TimeRegistrationStore();
        this.authStore = new AuthStore();
        this.clientStore = new ClientStore(this);
        this.cmsStore = new CmsStore();
        this.managementStore = new ManagementStore();
        this.tokenStore = TokenStore;
        this.userStore = new UserStore();
        /* get ProjectStore(){
             if(!this.projectStore) this.projectStore = new ProjectStore();
             return this.projectStore;

         }
         get CaseStore(){
         if(!this.caseStore) this.caseStore = new CaseStore(this);
         return this.caseStore;
     }
         */
    }

    get ProjectStore() {
        if (!this.projectStore) this.projectStore = new ProjectStore();
        return this.projectStore;

    }

    get CaseStore() {
        if (!this.caseStore) this.caseStore = new CaseStore(this);
        return this.caseStore;
    }

    get TimeRegistrationStore() {
        if (!this.timeRegistrationStore) this.timeRegistrationStore = new TimeRegistrationStore();
        return this.timeRegistrationStore;
    }

    get AuthStore() {
        if (!this.authStore) this.authStore = new AuthStore();
        return this.authStore;
    }

    get ClientStore() {
        if (!this.clientStore) this.clientStore = new ClientStore(this);
        return this.clientStore;
    }

    get CmsStore() {
        if (!this.cmsStore) this.cmsStore = new CmsStore();
        return this.cmsStore;
    }

    get ManagementStore() {
        if (!this.managementStore) this.managementStore = new ManagementStore();
        return this.managementStore;
    }

    get TokenStore() {
        if (!this.tokenStore) this.tokenStore = TokenStore;
        return this.tokenStore;
    }

    get UserStore() {
        if (!this.userStore) this.userStore = new UserStore();
        return this.userStore;
    }
}

export default (new StoreRegistry())