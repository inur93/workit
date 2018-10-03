import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, observable} from 'mobx';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    TextField,
    withStyles
} from "@material-ui/core";
import Editable from "../cms/Editable";

const styles = theme => ({
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    formControl: {
        minWidth: '120px',
        marginLeft: '10px'
    }
});

class CreateRole extends Component {

    name = "";
    parent = null;

    constructor(props) {
        super(props);
    }

    create = () => {
        this.props.onCreate({
            name: this.name,
            parent: this.parent && this.parent.json
        })
    }

    handleChange = (evt) => {
        this.parent = this.props.roles.find(r => r.id === evt.target.value);
    }

    render() {
        const {onClose, classes, roles} = this.props;
        const {name, parent} = this;
        return (
            <Dialog open={true}>
                <DialogTitle><Editable useModal field="create-role-title"/></DialogTitle>
                <DialogContent>
                    <FormControl>
                    <TextField
                        label={<Editable useModal field="name"/>}
                        value={name}
                        onChange={(evt) => this.name = evt.target.value}
                    />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="select-parent">Inherits from</InputLabel>
                        <Select
                            native
                            value={parent ? parent.id : ""}
                            inputProps={{id: "select-parent"}}
                            onChange={this.handleChange}
                            className={classes.selectEmpty}
                        >
                            <option value=""/>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="raised" onClick={this.create}>Create</Button>,
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(CreateRole));

CreateRole.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    roles: PropTypes.object
}

CreateRole.defaultProps = {};

decorate(CreateRole, {
    name: observable,
    parent: observable
})