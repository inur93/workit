import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import Grid from "@material-ui/core/Grid/Grid";
import CustomTextField from "./CustomTextField";
import CustomButton from "./CustomButton";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import IconButton from "@material-ui/core/IconButton/IconButton";
import OrderIcon from "@material-ui/core/SvgIcon/SvgIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import DeleteIcon from '@material-ui/icons/Delete';
import {D} from "../cms/Editable";

const styles = theme => ({}
);

class SimpleListEditor extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        const {value, list, label, onChange, onRemove, onAdd} = this.props;
        return (
            <form onSubmit={onAdd}>
                <FormLabel component="legend">{label}</FormLabel>
                <Grid container spacing={16}>
                    <Grid item >
                        <CustomTextField placeholder={D("Add new value...")} value={value}
                                         onChange={onChange}/>
                    </Grid>
                    <Grid item>
                        <CustomButton variant="raised" color="primary" type="submit">Add</CustomButton>
                    </Grid>

                    <Grid item >
                        <List dense disablePadding>
                            {list.map(value =>
                                <ListItem key={value} >
                                   {/* <ListItemIcon>
                                        <IconButton aria-label="Reorder">
                                            <OrderIcon/>
                                        </IconButton>
                                    </ListItemIcon>*/}
                                    <ListItemText primary={value}/>
                                    <ListItemSecondaryAction>
                                        <IconButton aria-label="Delete" onClick={() => onRemove(value)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>)}
                        </List>
                    </Grid>

                </Grid>
            </form>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(SimpleListEditor));

decorate(SimpleListEditor, {});

SimpleListEditor.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onAdd: PropTypes.func,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    list: PropTypes.array

}

SimpleListEditor.defaultProps = {}