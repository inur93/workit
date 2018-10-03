import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Close';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Button,
    FormControl, FormControlLabel, TextField
} from '@material-ui/core';
import RichTextEditor from 'react-rte';
import SingleLineEditor from "./SingleLineEditor";
import RteEditor from "./RteEditor";
import Editable from "./Editable";

const styles = theme => ({
    editorContainer: {
        position: 'absolute',
        zIndex: '3000',
        display: 'flex',
    },
    iconContainer: {
        position: 'relative'
    },
    toolbar: {
        position: 'absolute',
        width: '30px',
        backgroundColor: theme.palette.secondary.light,//'#e4e3e3',
        borderRadius: '5px 5px 0px 0px',
        '& $icon': {
            top: '3px'
        }
    },
    icon: {
        fontSize: '16px',
        position: 'absolute',
        right: '8px;',

        /*top: '10px'*/
    },
    actions: {
        position: 'absolute',
        backgroundColor: theme.palette.secondary.light,//'#e2e2e2',
        zIndex: '3000'
    },
    action: {
        fontSize: '14px',
        minHeight: '16px',
        minWidth: '24px',
        padding: '0px'
    },
});

export const types = {
    RichText: 'rte',
    SingleLineText: 'txt',
    Button: 'btn'
}

class EditableEditor extends Component {

    cancelPrompt = false;

    constructor(props) {
        super(props);

    }

    getEditor = (type, dimensions, classes, useModal) => {
        switch (type) {
            case types.RichText:
                return <RteEditor
                    onSave={this.save}
                    onCancel={this.cancel}
                    value={this.props.value}
                />;
            case types.Button:
            case types.SingleLineText:
            default:
                return <SingleLineEditor
                    useModal={useModal}
                    fontSize={this.props.fontSize}
                    onCancel={this.cancel}
                    dimensions={dimensions}
                    value={this.props.value}
                    onSave={this.save}
                />
        }
    };

    cancel = (prompt) => {
        if(prompt){
            this.cancelPrompt = true;
        }else{
            this.props.onCancel();
        }
    };

    save = (value) => {
      this.props.onSave(value);
    };

    render() {
        const {type, dimensions, classes, textOptions, useModal, alwaysUseModal} = this.props;
        const {cancelPrompt} = this;
        const editor = this.getEditor(type, dimensions, classes, useModal || alwaysUseModal);

        return <div>
            {editor}
            <Dialog
                open={cancelPrompt}
                onClose={() => this.cancelPrompt = false}
                aria-labelledby="cancel-dialog-title"
                aria-describedby="cancel-dialog-description"
            >
                <DialogTitle id="cancel-dialog-title"><Editable field={textOptions.cancelPromptTitle}/></DialogTitle>
                <DialogContent>
                    <DialogContentText id="cancel-dialog-description">
                        <Editable field={textOptions.cancelPromptMessage} />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.cancelPrompt = false} color="primary">
                        <Editable lock field={textOptions.goBack} />
                    </Button>
                    <Button onClick={() => this.cancel(false)} color="primary">
                        <Editable lock field={textOptions.cancelWithoutSaving} />
                    </Button>
                    <Button onClick={this.save} color="primary" variant="raised" autoFocus>
                        <Editable lock field={textOptions.save}/>
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    }
}

export default withStyles(styles, {withTheme: true})(observer(EditableEditor));

decorate(EditableEditor, {
    cancelPrompt: observable,
    cancel: action,
    save: action,
});

EditableEditor.propTypes = {
    type: PropTypes.oneOf([types.RichText, types.SingleLineText, types.Button]),
    useModal: PropTypes.bool,
    alwaysUseModal: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    fontSize: PropTypes.string,
    textOptions: PropTypes.shape({
        title: PropTypes.string,
        save: PropTypes.string,
        cancel: PropTypes.string,
        cancelPromptMessage: PropTypes.string,
        yes: PropTypes.string,
        no: PropTypes.string,

    }),
    dimensions: PropTypes.shape({
        top: PropTypes.number,
        left: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number
    })
};

EditableEditor.defaultProps = {
    fontSize: "16px"
};