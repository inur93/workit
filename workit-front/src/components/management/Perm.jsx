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
    let allowedList = [];
    const policies = Perm.config.userStore && Perm.config.userStore.policies;
    if (!policies) return false;

    const hasPermission = (policy) => {
        let matchingPolicies = policies
            .filter(p => new RegExp(policy.resource).test(p.resources[0]));


        if (matchingPolicies && matchingPolicies.length > 0) {
            //concat all permissions for all matching resources to
            // determine if the combined policy has appropriate access
            let permissions = [];
            matchingPolicies.forEach(p => {
               p.permissions.forEach(perm => permissions.push(perm));
            });

            let hasAccess = true;
            policy.permissions.forEach(p => {
                if(!permissions.includes(p)){
                    hasAccess = false;
                }
            });
            return hasAccess;
        }
        return false;
    };
    if (policy instanceof Array) {
        for (let i = 0; i < policy.length; i++) {
            const perm = policy[i];
            if (hasPermission(perm)) {
                allowedList.push(perm);
            }
        }
    } else {
        allowed = hasPermission(policy);
    }
    return allowed || (allowedList.length >= policy.length);
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
    permissions: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

decorate(Perm, {
    allowed: computed
});



