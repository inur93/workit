import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, observable} from 'mobx';
import {TextField} from "@material-ui/core";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, Input,
    InputLabel, MenuItem, Select,
    withStyles
} from "@material-ui/core";
import Role from "../../models/management/Role";

const styles = theme => ({
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    formControl: {
        minWidth: '120px',
        marginLeft: '10px'
    }
});

class EditRole extends Component {

    name = "";
    parent = null;

    constructor(props) {
        super(props);
        this.name = props.role.name;
        this.parent = props.role.parent;
    }

    handleChange = (evt) => {
        this.parent = this.props.roles.find(r => r.id === evt.target.value);
    }

    save = () => {
        this.props.onSave(
            {
                id: this.props.role.id,
                name: this.name,
                parent: this.parent
            });
    }

    delete = () => {
        this.props.onDelete(this.props.role);
    }

    render() {
        const {onClose, classes, roles, role} = this.props;
        const {name, parent} = this;
        return (
            <Dialog open={true}>
                <DialogTitle>Edit role</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <TextField
                            label={"Name"}
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
                            {roles
                                .filter(r => !r.isParent(role))
                                .map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button color="primary"
                            variant="raised"
                            onClick={this.save}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(EditRole));

EditRole.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    roles: PropTypes.object,
    role: PropTypes.instanceOf(Role)
}

EditRole.defaultProps = {}

decorate(EditRole, {
    name: observable,
    parent: observable
})