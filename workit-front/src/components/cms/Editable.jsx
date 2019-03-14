import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import {MuiThemeProvider, withStyles} from "@material-ui/core/styles";
import {action, computed, decorate, observable} from "mobx";
import EditableEditor, {types} from "./EditableEditor";
import {error, success} from "../shared/Toast";

const styles = theme => ({
    editableField: {
        '& $border:hover': {
            border: '1px dashed black'
        },
        /* display: 'inline-block'*/
    },
    border: {
        position: 'absolute',
        zIndex: '1300',
    },

});

export const D = (val) => {
    return Editable.config.options.getField(val);
};

class Editable extends Component {

    ref = null;
    dims = {};
    absDims = {};

    showToolbar = false;
    showCancelPrompt = false;

    static config = {
        options: {}
    };

    get editMode() {
        if(this.props.lock) return false;
        return Editable.config.options.editModeContainer && Editable.config.options.editModeContainer.editModeEnabled;
    }

    get options() {
        return this.props.options || Editable.config.options;
    }

    get theme() {
        return Editable.config.options.editModeContainer && Editable.config.options.editModeContainer.theme;
    }

    get alwaysUseModal(){
        return Editable.config.options.editModeContainer && Editable.config.options.editModeContainer.alwaysUseModal;
    }

    constructor(props) {
        super(props);
    }

    handleEdit = (evt) => {
        if (evt) evt.stopPropagation();
        if (evt) evt.preventDefault();
        const dims = this.absDims;
        let fontSize = window.getComputedStyle(this.ref, null).getPropertyValue('font-size');
        setTimeout(() => {
            ReactDOM.render(<MuiThemeProvider theme={this.theme}>
                <EditableEditor
                    key={`${dims.top}-${dims.left}`}
                    useModal={this.props.useModal}
                    alwaysUseModal={this.alwaysUseModal}
                    value={this.value}
                    dimensions={dims}
                    fontSize={fontSize}
                    textOptions={this.props.textOptions}
                    type={this.props.type}
                    onSave={this.save}
                    onCancel={this.cancel}
                />
            </MuiThemeProvider>, document.getElementById('cms-content'));
        }, 100);
    };
    exitEditMode = (evt) => {
        if (evt) evt.stopPropagation();
        ReactDOM.render(<span/>, document.getElementById('cms-content'));
        this.showToolbar = false; // to make sure it is hidden since it is only hidden when mouse leaves div - which is not detected when modal is popped up
    };
    save = (value) => {
        return this.options.updateField({
            name: this.props.field,
            value: value
        }).then(saved => {
            if (Editable.config.options.notifyOnSave) {
                success("Changes saved");
            }
            this.exitEditMode();
        }).catch(err => {
            if (Editable.config.options.notifyOnError) {
                error("Changes were not saved");
            }
        });
    };

    cancel = (evt) => {
        if (evt) evt.stopPropagation();
        this.showCancelPrompt = false; //make sure prompt is hidden
        this.exitEditMode(evt);
    };

    cancelWithPrompt = (evt) => {
        if (evt) evt.stopPropagation();
        if (this.hasChange) {
            this.showCancelPrompt = true;
        } else {
            this.cancel(evt);
        }
    }


    setRef = (ref) => {
        this.ref = ref;
    };
    handleShowToolbar = () => {
        this.showToolbar = true;
        if (this.ref) {
            let c = this.ref; //.parentElement;
            const dims = {
                top: c.offsetTop, left: c.offsetLeft, height: c.offsetHeight, width: c.offsetWidth
            };
            let children = c;
            while (children = children.children) {
                if (children.length === 0) break;
                dims.width = dims.width + children[0].offsetWidth;
                let diffTop = children[children.length - 1].offsetTop - children[0].offsetTop;
                let height = dims.height + (diffTop + children[children.length - 1].offsetHeight);
                dims.height = height;
            }
            let parent = c;
            while (parent = parent.parentElement) {
                if (dims.width && dims.height) break;
                dims.width = parent.offsetWidth;
                dims.height = parent.offsetHeight;
            }
            this.dims = dims;
            while ((c = c.offsetParent)) {
                dims.top = dims.top + c.offsetTop;
                dims.left = dims.left + c.offsetLeft;
            }
            this.absDims = dims;
        }
    };
    handleHideToolbar = () => {
        this.showToolbar = false;
    };


    get value() {
        return this.options.getField(this.props.field);
    }

    render() {
        if(!this.props.field) return <span/>;
        const {classes, type} = this.props;
        const {editMode} = this;
        const dims = this.dims;
        const isRte = (type === types.RichText);

        if (editMode) {
            return <span
                onMouseEnter={this.handleShowToolbar}
                onMouseLeave={this.handleHideToolbar}
                onClick={this.handleEdit}
                className={classes.editableField}
            >
                <span className={classes.border} style={{
                    top: `${dims.top}px`,
                    left: `${dims.left}px`,
                    height: `${dims.height}px`,
                    width: `${dims.width}px`
                }}/>
                {isRte ?
                    <span ref={this.setRef} dangerouslySetInnerHTML={{__html: this.value}}/> :
                    <span ref={this.setRef}>{this.value}</span>
                }

            </span>;
        }
        return isRte ? <span dangerouslySetInnerHTML={{__html: this.value}}/> :
            this.value;
    }
};

export default withStyles(styles, {withTheme: true})(observer(Editable));

Editable.propTypes = {
    type: PropTypes.oneOf(['btn', 'rte', 'txt']),
    useModal: PropTypes.bool,
    field: PropTypes.string.isRequired,
    lock: PropTypes.bool,
    options: PropTypes.shape({
        enableEditMode: PropTypes.bool,
        notifyOnError: PropTypes.bool,
        notifyOnSave: PropTypes.bool,
        updateField: PropTypes.func,
        getField: PropTypes.func,
        editor: PropTypes.func,
        showEditHint: PropTypes.bool
    }),
    textOptions: PropTypes.shape({
        title: PropTypes.string,
        save: PropTypes.string,
        cancel: PropTypes.string,
        cancelPromptMessage: PropTypes.string,
        yes: PropTypes.string,
        no: PropTypes.string,

    })
};

Editable.defaultProps = {
    type: 'txt',
    textOptions: {
        cancelPromptTitle: "Unsaved changes...",
        cancelPromptMessage: "You have changes that have not been saved. How do you want to proceed?",
        cancelWithoutSaving: "Cancel without saving",
        save: "Save changes",
        goBack: "Go back"

    }
};

decorate(Editable, {
    value: computed,
    theme: computed,
    editMode: computed,
    alwaysUseModal: computed,

    options: computed,
    dims: observable,
    absDims: observable,

    ref: observable,
    showToolbar: observable,
    showCancelPrompt: observable,

    handleEdit: action,
    exitEditMode: action,
    save: action,
    cancel: action,
    handleShowToolbar: action,
    handleHideToolbar: action
});
