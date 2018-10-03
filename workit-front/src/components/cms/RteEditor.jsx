import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {computed, decorate, observable} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import RichTextEditor from 'react-rte';
import Editable from "./Editable";

const styles = theme => ({}
);

class RteEditor extends Component {

    value;
    constructor(props) {
        super(props);
        this.value = RichTextEditor.createValueFromString(props.value, 'html');
    }

    get hasChange() {
        return this.value.toString('html') !== this.props.value;
    }

    save = () => {
        this.props.onSave(this.value.toString('html'));
    };

    cancelWithPrompt = (evt) => {
        if (this.hasChange) {
            this.cancelPrompt = true;
        } else {
            this.cancel(evt);
        }
    };

    cancel = (evt) => {
        this.props.onCancel(evt);
    };

    render() {
        const {classes} = this.props;
        return (
            <Dialog
                open={true}
                onClose={this.cancelWithPrompt}
                aria-labelledby="rte-dialog-title"
            >
                <DialogTitle id="rte-dialog-title"><Editable field="edit"/></DialogTitle>
                <DialogContent>
                    <RichTextEditor autoFocus value={this.value}
                                    onChange={(value) => this.value = value}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.cancel} color="primary">
                        <Editable lock field="cancel" />
                    </Button>
                    <Button disabled={!this.hasChange} onClick={this.save} color="primary" variant="raised">
                        <Editable lock field="save"/>
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(RteEditor));

decorate(RteEditor, {
    value: observable,

    hasChange: computed,
});

RteEditor.propTypes = {
    value: PropTypes.string,
    onSave: PropTypes.func,
    onCancel: PropTypes.func
};

RteEditor.defaultProps = {};