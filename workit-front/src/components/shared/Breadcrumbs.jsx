import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import {Link, Route, withRouter} from "react-router-dom";
import Editable from "../cms/Editable";

const styles = theme => ({}
);

const Breadcrumb = ({match}) =>
    <div style={{display: 'inline-block'}}>
        ><Link to={match.url}>&nbsp;{match.params.path} &nbsp;</Link>
    <Route path={`${match.url}/:path`} component={Breadcrumb} />
    </div>;
class Breadcrumbs extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        const {match} = this.props;
        return (
            <div style={{display: 'inline-block'}}>
                <Link to={match.url}><Editable field={"home"}/>&nbsp;</Link>
            <Route path={`/:path`} component={Breadcrumb} />
            </div>
        )
    }
}

export default withRouter(withStyles(styles, {withTheme: true})(observer(Breadcrumbs)));

decorate(Breadcrumbs, {});

Breadcrumbs.propTypes = {}

Breadcrumbs.defaultProps = {}