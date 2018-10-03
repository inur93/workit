import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField/TextField";
import Editable, {D} from "../cms/Editable";

const styles = theme => ({
        textField: {
            display: 'block',
        },
    }
);

class CustomTextField extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        const {classes, label, helperText, placeholder, fullWidth, ...otherProps} = this.props;
        return (
            <TextField {...otherProps}
                       label={D(label)}
                       helperText={D(helperText)}
                       placeholder={D(placeholder)}
                       fullWidth={fullWidth}
                       className={classes.textField}/>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(CustomTextField));

decorate(CustomTextField, {});

CustomTextField.propTypes = {
    fullWidth: PropTypes.bool,
    label: PropTypes.string,
    helperText: PropTypes.string,
    placeholder: PropTypes.string
};

CustomTextField.defaultProps = {
    fullWidth: true
};