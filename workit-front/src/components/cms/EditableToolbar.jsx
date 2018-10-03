import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({}
);

class EditableToolbar extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div>
                EditableToolbar
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(EditableToolbar));

decorate(EditableToolbar, {});

EditableToolbar.propTypes = {}

EditableToolbar.defaultProps = {}