import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, observable} from 'mobx';
import {red, green} from '@material-ui/core/colors';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Switch,
    withStyles
} from "@material-ui/core";
import Editable from "../cms/Editable";

const styles = theme => ({
    switchBase: {
        color: red[500],
        '& + $bar': {
            backgroundColor: red[500]
        },
        '&$checked': {
            color: green[500],
            '& + $bar': {
                backgroundColor: green[500],
            },
        },
    },
    bar: {},
    checked: {},

    editableField: {
        '&:hover': {
            '.editable-field-content': {
                border: '1px dashed black'
            }
        }
    }
})


class EditPolicy extends Component {

    policy = null;

    constructor(props) {
        super(props);
        this.policy = props.policy.json;
    }

    save = () => {
        this.props.onUpdate(this.policy);
    };

    render() {
        const {onClose, classes, policy} = this.props;
        return (
            <Dialog open={true}>
                <DialogTitle><Editable useModal field="edit-policy"/></DialogTitle>
                <DialogContent>
                    <FormControlLabel
                        control={<Switch
                            classes={{
                                switchBase: classes.switchBase,
                                bar: classes.bar,
                                checked: classes.checked
                            }}
                            id="inherit-from-parent"
                            key={`inherit-from-parent-switch`}
                            checked={this.policy.inheritsFromParent}
                            disabled={!this.props.policy.resource.parentResource}
                            value={"" + this.policy.inheritsFromParent}
                            onChange={(evt, checked) => {
                                this.policy.inheritsFromParent = checked;
                            }}
                        />}
                        label="Inherit from parent"
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="primary"
                            variant="raised"
                            onClick={this.save}>
                        <Editable field="save"/>
                    </Button>
                    <Button onClick={onClose}><Editable field="close"/></Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(EditPolicy));

EditPolicy.propTypes = {
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    policy: PropTypes.object.isRequired,
    policies: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

EditPolicy.defaultProps = {};

decorate(EditPolicy, {
    policy: observable
});