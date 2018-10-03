import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField/TextField";
import {D} from "../cms/Editable";

const styles = theme => ({}
);

/**
 * For rendering any type of fields value.
 */
class CustomField extends Component
{

    constructor(props)
    {
        super(props);
    }


    render()
    {
        const {type, title, required, value} = this.props.field;
        if(type === "text") {
            return (
                <TextField label={D(title)} required={required} value={value}/>
            )
        }
        return (<div>'{type}' not implemented yet</div>)
    }
}

export default withStyles(styles, {withTheme: true})(observer(CustomField));

decorate(CustomField, {});

CustomField.propTypes = {
    field: PropTypes.shape({
        type: PropTypes.oneOf(["text", "rte", "number", "checkbox", "dropdown"]),
        title: PropTypes.string,
        required: PropTypes.bool,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
    })
};

CustomField.defaultProps = {};