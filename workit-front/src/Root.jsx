import React, {Component} from 'react';
import {observer, Provider} from 'mobx-react';
import {decorate, observable, reaction} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import {Link, Route, Switch, withRouter} from "react-router-dom";
import Login from "./components/Login";
import App from "./App";
import {Links} from "./config/Links";
import Editable from "./components/cms/Editable";
import Perm from "./components/management/Perm";
import {themes} from "./Theme";
import {Title} from "./components/shared/SimpleComponents";
import StoreRegistry from "./stores/StoreRegistry";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import ToastContainer from "./stores/ToastStore";
import Toast from "./components/shared/Toast";

const styles = theme => ({}
);


const themeOptions = {
    blue: 'defaultTheme',
    green: 'greenTheme',
    red: 'redTheme'
};

export const cmsOptions = {
    notifyOnError: false, //errors are handled in agent
    notifyOnSave: true,
    getField: StoreRegistry.cmsStore.getField,
    updateField: StoreRegistry.cmsStore.saveField,
    showEditHint: false,
    editModeContainer: null
};

//Editable and Perm component
Editable.config.options = cmsOptions;
Perm.config.userStore = StoreRegistry.UserStore;
Perm.config.authStore = StoreRegistry.authStore;


class Root extends Component {

    theme = themes[localStorage.getItem('theme') || 'defaultTheme'];

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.handleRedirect(this.props);
        reaction(() => StoreRegistry.tokenStore.token, token => {
            if (!token) this.handleRedirect(this.props);
        })
    }

    selectTheme = (theme) => {
        localStorage.setItem('theme', theme);
        this.theme = themes[theme];
    };

    handleRedirect = (nextProps) => {
        if (!StoreRegistry.tokenStore.token) {
            let url = nextProps.location.pathname;
            if (url !== "/") {
                nextProps.history.push("/login?returnUrl=" + url);
            } else {
                nextProps.history.push("/login")
            }
        } else if (nextProps.location.pathname === "/" || nextProps.location.pathname === Links.login()) {
            this.props.history.push(Links.home())
        }
    };

    handleClose = (val1, val2, val3) => {
        if (val1) {
            ToastContainer.info("test message");
        }
    };

    render() {
        const {AuthStore} = StoreRegistry;
        return (
            <Provider {...StoreRegistry}>
                <div>
                    <Switch>
                        <Route path={Links.login()}
                               render={() => <Login authStore={AuthStore} theme={this.theme}/>}
                        />
                        <Route path={Links.home()}
                               render={({match}) => <App stores={StoreRegistry} theme={this.theme}
                                                  onThemeChanged={this.selectTheme}/>}
                        />
                        <Route path={"/"}
                               render={() => <div><Title>page not found</Title>
                                   <Link to={Links.home()}>go to home page</Link></div>}
                        />
                    </Switch>
                    <Toast/>
                </div>
            </Provider>
        )
    }
}

export default withRouter(withStyles(styles, {withTheme: true})(observer(Root)));

decorate(Root, {
    theme: observable
});

Root.propTypes = {};

Root.defaultProps = {};