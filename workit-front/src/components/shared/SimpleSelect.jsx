import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import {CustomInputLabel} from "./SimpleComponents";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Editable, {D} from "../cms/Editable";
import FormControl from "@material-ui/core/FormControl/FormControl";

const styles = theme => ({
        formControl: {
            /*margin: theme.spacing.unit,*/
            minWidth: 180,
        },
    }
);

class SimpleSelect extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {classes, label, selected, values, handleChange, ...otherProps} = this.props;

        return (
            <FormControl className={classes.formControl}>
                <CustomInputLabel htmlFor={`${label}-select`}>{D(label)}</CustomInputLabel>
                <Select {...otherProps}
                        value={selected}
                        onChange={handleChange}
                        inputProps={{
                            name: `${label}`,
                            id: `${label}-select`,
                        }}
                >
                    {values.map(val =>
                        <MenuItem key={val} value={val}>
                            <Editable field={val}/>
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(SimpleSelect));

decorate(SimpleSelect, {});

SimpleSelect.propTypes = {
    label: PropTypes.string,
    selected: PropTypes.string,
    values: PropTypes.array,
    handleChange: PropTypes.func
}

SimpleSelect.defaultProps = {
    values: []
};