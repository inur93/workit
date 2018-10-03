import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Link, Route, Switch, withRouter} from "react-router-dom";
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import {inject, observer} from "mobx-react";
import {exec} from 'child_process';
import {action, decorate, observable, reaction} from "mobx";
import Editable from "./components/cms/Editable";

import CreateClient from "./components/client/CreateClient";
import {navLinks} from "./index";
import ClientDashboard from "./components/client/ClientDashboard";
import ProjectDashBoard from "./components/project/ProjectDashBoard";
import {Links} from "./config/Links";
import ProjectSettings from "./components/project/ProjectSettings";
import CreateCase from "./components/case/CreateCase";
import ViewCase from "./components/case/ViewCase";
import EditCase from "./components/case/EditCase";
import TopMenu from "./components/TopMenu";
import Drawer from "@material-ui/core/Drawer/Drawer";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Divider from "@material-ui/core/Divider/Divider";
import List from "@material-ui/core/List/List";
import ListSubheader from "@material-ui/core/ListSubheader/ListSubheader";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import Select from "@material-ui/core/Select/Select";


import UsersIcon from '@material-ui/icons/Group';
import PermissionIcon from '@material-ui/icons/Group';
import TimeIcon from '@material-ui/icons/Timelapse';
import ContactIcon from '@material-ui/icons/Phone';
import SecurityIcon from '@material-ui/icons/Security';
import SettingsIcon from '@material-ui/icons/Settings';

import Toggle from '@material-ui/core/Switch';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import EditIcon from '@material-ui/icons/Edit';
import HomeIcon from '@material-ui/icons/Home';
import CasesIcon from '@material-ui/icons/List';
import EnvironmentIcon from '@material-ui/icons/Terrain';
import Home from "./components/Home";
import {
    SidebarNavGroup,
    SidebarNavItem,
    SidebarNavItemCollapse,
    SidebarNavItemRoute, SidebarNavItemStatic,
    Title
} from "./components/shared/SimpleComponents";
import ViewClients from "./components/client/ViewClients";
import CreateProject from "./components/project/CreateProject";
import TimeRegistration from "./components/timeregistration/TimeRegistration";
import ProjectPermissions from "./components/project/ProjectPermissions";
import {Policies} from "./config/Policies";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import EditClient from "./components/client/EditClient";
import TokenStore from "./stores/TokenStore";
import UserStore from "./stores/UserStore";
import MyProfile from "./components/profile/MyProfile";
import CmsStore from "./stores/CmsStore";
import Collapse from "@material-ui/core/Collapse/Collapse";
import ProjectStore from "./stores/ProjectStore";
import ClientStore from "./stores/ClientStore";
import EditProject from "./components/project/EditProject";
import Perm from "./components/management/Perm";

const drawerWidth = 340;
const styles = theme => ({
    body: {
        '& p, h1, h2, h3, h4, div, input': {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
        }
    },
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
        maxHeight: '100vh'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appFrame: {
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        position: 'absolute',
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        overflowY: 'auto',
        height: 'calc(100vh - 75px)',
        marginTop: '75px',
        paddingTop: 0,
        paddingBottom: 0,
        minWidth: 0, // So the Typography noWrap works
    },

});

class App extends Component {


    open = false;
    editModeEnabled = localStorage.getItem("editMode") === "true";
    alwaysUseModal = true;

    constructor(props) {
        super(props);
        Editable.config.options.editModeContainer = this;
    }

    componentWillMount() {
        const {tokenStore, userStore, history} = this.props;
        if (!tokenStore.token) history.push(Links.login());

        reaction(() => userStore.self, self => {
            let editMode = localStorage.getItem("editMode");
            if (userStore.hasAccess(Policies.fieldsAdmin())) {
                this.editModeEnabled = (editMode === "true");
            } else {
                this.editModeEnabled = false;
            }
        });
        reaction(() => this.editModeEnabled, editModeEnabled => {
            localStorage.setItem("editMode", `${editModeEnabled}`);
        });
    }

    handleDrawerOpen = () => {
        this.open = true;
    };

    handleDrawerClose = () => {
        this.open = false;
    };

    toggleEditMode = () => {
        this.editModeEnabled = !this.editModeEnabled;
    };

    render() {
        const {classes, cmsStore, clientStore, projectStore} = this.props;
        const {open, editModeEnabled} = this;
        //TODO show only drawer when project has been selected - settings etc can always be accessed via the profile icon in top right
        const drawer = (
            <Drawer
                variant="permanent"
                anchor="left"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <Editable field="menu-title"/>
                    <IconButton onClick={this.handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <List component="nav">
                    <SidebarNavItemStatic label={"home"} to={Links.home} exact icon={<HomeIcon/>}/>
                    <SidebarNavItemStatic label={"clients"} to={Links.clients} exact icon={<HomeIcon/>}
                                          policy={Policies.clientsRead()}/>

                    <SidebarNavGroup path={Links.client()} children={(match, path) => {
                        let clientId = match && match.params.clientId;
                        if (clientStore.currentClient) clientId = clientStore.currentClient.id;
                        return <div>
                            <ListSubheader>{clientId}</ListSubheader>
                            <SidebarNavItem label="projects"
                                            to={Links.client}
                                            exact icon={<CasesIcon/>}
                                            policy={Policies.clientsIdRead(match && match.params.clientId)}
                                            param={"clientId"}
                                            match={match}
                                            path={path}
                            />
                            <SidebarNavItem label={"manage-client"}
                                            to={Links.clientManage}
                                            exact icon={<SettingsIcon/>}
                                            policy={Policies.clientsIdAdmin(match && match.params.clientId)}
                                            param={"clientId"}
                                            match={match}
                                            path={path}
                            />
                        </div>
                    }
                    }/>

                    <SidebarNavGroup path={Links.project()} children={(match, path) => {
                        let projectId = match && match.params.projectId;
                        if (projectStore.currentProject) projectId = projectStore.currentProject.id;
                        return <div>
                            <ListSubheader>{projectId}</ListSubheader>
                            <SidebarNavItem label={"cases"}
                                            to={Links.project}
                                            exact icon={<CasesIcon/>}
                                            policy={Policies.projectsIdRead(projectId)}
                                            param={"projectId"}
                                            match={match}
                                            path={path}/>
                            <SidebarNavItem label={"manage-project"}
                                            to={Links.projectManage}
                                            exact icon={<SettingsIcon/>}
                                            policy={Policies.projectsIdAdmin(projectId)}
                                            param={"projectId"}
                                            match={match}
                                            path={path}/>
                        </div>
                    }}/>
                    <Divider/>
                    <SidebarNavItemStatic label={"time registrations"} to={Links.timeRegistration} icon={<TimeIcon/>}
                                          policy={Policies.mgmUsersSelfTimeRegRead()}/>

                    <Divider/>
                    {/*<Perm permissions={Policies.mgmAdmin()}>
                        <ListSubheader><Editable field="settings"/></ListSubheader>
                        <ListItem>
                            <ListItemIcon>
                                <EditIcon/>
                            </ListItemIcon>
                            <ListItemText primary={<Editable field="edit-toggle-menu-item"/>}/>
                            <ListItemSecondaryAction>
                                <Toggle disableRipple
                                        checked={editModeEnabled}
                                        onChange={this.toggleEditMode}
                                        color="primary"
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem button component={Link} to={navLinks.MANAGE_FIELDS} onClick={this.handleDrawerClose}>
                            <ListItemIcon>
                                <EditIcon/>
                            </ListItemIcon>
                            <ListItemText primary={<Editable field="manage-fields"/>}/>
                        </ListItem>
                    </Perm>*/}
                    <ListSubheader><Editable field="Language"/></ListSubheader>
                    <ListItem divider>
                        <Select
                            fullWidth
                            value={cmsStore.currentLanguage}
                            onChange={evt => cmsStore.currentLanguage = evt.target.value}>
                            {cmsStore.languages.map(lang => <MenuItem key={lang} value={lang}><Editable lock
                                                                                                        field={lang}/>
                            </MenuItem>)}
                        </Select>
                    </ListItem>
                </List>

            </Drawer>
        );


        return (
            <MuiThemeProvider theme={this.props.theme}>
                <div className={[classes.appFrame, classes.body].join(' ')}>

                    <TopMenu open={open}/>
                    {drawer}

                    <main className={classes.content}>

                        <div className={[classes['content-left'],
                            open && classes.contentShift,
                            open && classes['contentShift-left']].join(' ')}>

                            <div>
                                <Switch>
                                    <Route path={Links.home()} exact component={Home}/>
                                    <Route path={Links.timeRegistration()} exact component={TimeRegistration}/>
                                    <Route path={Links.createClient()} exact component={CreateClient}/>
                                    <Route path={Links.clients()} exact component={ViewClients}/>
                                    <Route path={Links.client()} exact component={ClientDashboard}/>
                                    <Route path={Links.clientManage()} exact component={EditClient}/>
                                    <Route path={Links.createProject()} exact component={CreateProject}/>
                                    <Route path={Links.project()} exact component={ProjectDashBoard}/>
                                    <Route path={Links.projectManage()} exact component={EditProject}/>
                                    <Route path={Links.projectPermissions()} exact component={ProjectPermissions}/>
                                    <Route path={Links.createCase()} exact component={CreateCase}/>
                                    <Route path={Links.viewCase()} exact component={ViewCase}/>
                                    <Route path={Links.editCase()} exact component={EditCase}/>
                                    <Route path={Links.profile()} exact component={MyProfile}/>
                                    <Route path={"/"} render={() => <Title>Page not found</Title>}/>
                                </Switch>
                            </div>
                        </div>
                    </main>
                </div>
            </MuiThemeProvider>
        )
    }
}


export default withRouter(withStyles(styles, {withTheme: true})(inject("userStore", "cmsStore", "tokenStore", "clientStore", "projectStore")(observer(App))));

App.propTypes = {
    cmsStore: PropTypes.instanceOf(CmsStore),
    tokenStore: PropTypes.object.isRequired,
    userStore: PropTypes.instanceOf(UserStore),
    clientStore: PropTypes.instanceOf(ClientStore),
    projectStore: PropTypes.instanceOf(ProjectStore),
    theme: PropTypes.object,
    onThemeChanged: PropTypes.func
};

App.defaultProps = {};

decorate(App, {
    open: observable,
    theme: observable,
    editModeEnabled: observable,
    toggleEditMode: action,
});