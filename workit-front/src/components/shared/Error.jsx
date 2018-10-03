import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import {Title} from "./SimpleComponents";
import {D} from "../cms/Editable";

const styles = theme => ({

    }
);

class Error extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className={this.props.classes.error}>
                <Title>{D(this.props.message)}</Title>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(Error));

decorate(Error, {});

Error.propTypes = {
    classes: PropTypes.object.isRequired,
    message: PropTypes.string.isRequired
}

Error.defaultProps = {};