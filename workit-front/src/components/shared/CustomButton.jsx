import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button/Button";
import Editable, {D} from "../cms/Editable";

const styles = theme => ({
        button: {
            borderRadius: 0
        }
    }
);

class CustomButton extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        const {classes, ...otherProps} = this.props;
        return (
            <Button {... otherProps} className={this.props.classes.button}>{D(this.props.children)}</Button>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(CustomButton));

decorate(CustomButton, {});

CustomButton.propTypes = {};

CustomButton.defaultProps = {};