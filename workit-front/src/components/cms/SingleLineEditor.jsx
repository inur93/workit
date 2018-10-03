import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import {Dialog, DialogTitle, DialogContent, DialogActions,
FormControl, TextField, Button} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Close';
import Editable from "./Editable";


const styles = theme => ({}
);

class SingleLineEditor extends Component {

    value = "";
    language = "";

    constructor(props) {
        super(props);
        this.value = props.value;
    }

    cancel = (evt) => {
        if(evt) evt.stopPropagation();
        this.props.onCancel();
    };

    cancelWithPrompt = () => {
        this.props.onCancel(this.hasChange);
    };

    save = () => {
        this.props.onSave(this.value);
    };

    get hasChange (){
        return this.value !== this.props.value;
    }


    keyHandler = (evt) => {
        if (evt.key === "Escape" || evt.keyCode === 27) {
            this.cancelWithPrompt();
        }
        if (evt.key === "Enter" || evt.keyCode === 13) {
            this.save();
        }
    };

    render() {
        const {useModal, dimensions, classes} = this.props;
        if(useModal){
            return <Dialog
                open={true}
                onClose={this.cancelWithPrompt}
                aria-labelledby="txt-dialog-title"
            >
                <DialogTitle id="txt-dialog-title"><Editable field="edit"/></DialogTitle>
                <DialogContent>
                    <FormControl fullWidth className={classes.formControl}>
                        <TextField
                            autoFocus={true}
                            value={this.value}
                            onChange={(evt) => this.value = evt.target.value}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.cancel} color="primary">
                        <Editable lock field="cancel"/>
                    </Button>
                    <Button disabled={!this.hasChange} onClick={this.save} color="primary" variant="raised">
                        <Editable lock field="save" />
                    </Button>
                </DialogActions>
            </Dialog>;
        }else{
            return <div className={classes.editorContainer}
                        style={{
                            width: `${dimensions.width}px`,
                            top: `${dimensions.top}px`,
                            left: `${dimensions.left}px`,
                        }}>
                <input type="text" value={this.updatedValue}
                       onChange={(evt) => this.updatedValue = evt.target.value}
                       autoFocus={true}
                       style={{width: `${dimensions.width}px`, fontSize: this.props.fontSize}}
                       onAbort={this.cancelWithPrompt}
                       onKeyUp={this.keyHandler}
                />
                <span className={classes.actions}
                      style={{
                          height: `${dimensions.height + 2}px`,
                          left: `${dimensions.width + 5}px`,
                          width: '50px'
                      }}>
                     <Button
                         color="inherit"
                         style={{
                             height: `${dimensions.height}px`
                         }}
                         className={[classes.action].join(" ")}
                         aria-label="cancel"
                         onClick={this.cancel}>
                         <CancelIcon style={{fontSize: '14px'}}/>
                     </Button>
                     <Button
                         disabled={!this.hasChange}
                         color="inherit"
                         style={{
                             height: `${dimensions.height}px`
                         }}
                         className={[classes.action].join(" ")}
                         aria-label="save"
                         onClick={this.save}>
                         <SaveIcon style={{fontSize: '14px'}}/>
                     </Button>
                 </span>
            </div>
        };
    }
}

export default withStyles(styles, {withTheme: true})(observer(SingleLineEditor));

decorate(SingleLineEditor, {
    value: observable,
    language: observable,

    hasChange: computed,

});

SingleLineEditor.propTypes = {
    value: PropTypes.string,
    useModal: PropTypes.bool,

    fontSize: PropTypes.string,
    dimensions: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
        top: PropTypes.number,
        left: PropTypes.number
    }),

    onCancel: PropTypes.func,
    onSave: PropTypes.func,
};

SingleLineEditor.defaultProps = {};