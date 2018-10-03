import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {HashRouter, Route} from 'react-router-dom';
import Root from "./Root";


export const navLinks = {
    HOME: "/",
    PROJECTS: "/projects", //deprecated
    CASES: "/cases",
    USERS: "/users",
    SETTINGS: "/settings",
    ENVIRONMENTS: "/environments",
    CONTACT: "/contact",
    TIME_REGISTRATION: "/time_registration",
    ADMINUSERS: "/administration/",
    DEMO: "/demo",
    LOGOUT: "/logout",
    MANAGE_ITEMS: '/manageitems',
    MANAGE_FIELDS: '/managefields'
};

export const Util = {
    formatDateEnglish: (date) => {
        try {
            return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
        } catch (err) {
            return "-";
        }
    }
};

ReactDOM.render((
        <HashRouter>
            <div>
                <Root />
            </div>
        </HashRouter>
    )
    , document.getElementById('root'));
registerServiceWorker();

