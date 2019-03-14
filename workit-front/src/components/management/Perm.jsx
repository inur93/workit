import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, computed} from 'mobx';
import {withStyles} from '@material-ui/core';

const styles = theme => ({

});

export const hasPerm = (policy) => {
    if (!policy) {
        console.warn("Permissions in Perm was undefined");
        return false;
    }
    let allowed = false;
    const roles = Perm.config.userStore && Perm.config.userStore.self && Perm.config.userStore.self.roles;
    if (!roles) return false;

    const hasPermission = (policy) => roles.includes(policy);

    if (policy instanceof Array) {
        for (let i = 0; i < policy.length; i++) {
            const perm = policy[i];
            if (hasPermission(perm)) {
                allowed = true;
            }
        }
    } else {
        allowed = hasPermission(policy);
    }
    return allowed;
};
class Perm extends Component {

    static config = {
        userStore: null,
        authStore: null
    }

    constructor(props) {
        super(props);
    }

    get allowed() {
        const {permissions} = this.props;
        return hasPerm(permissions);
    }

    render() {
        const {children} = this.props;
        if (this.allowed)
            return children;
        return null;
    }
}

export default withStyles(styles, {withTheme: true})(observer(Perm));

Perm.propTypes = {
    permissions: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

decorate(Perm, {
    allowed: computed
});



