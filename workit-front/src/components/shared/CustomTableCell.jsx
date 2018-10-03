import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import TableCell from "@material-ui/core/TableCell/TableCell";
import Editable from "../cms/Editable";

const styles = theme => ({}
);

class CustomTableCell extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <TableCell {... this.props} ><Editable field={this.props.children}/></TableCell>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(CustomTableCell));

decorate(CustomTableCell, {});

CustomTableCell.propTypes = TableCell.propTypes;

CustomTableCell.defaultProps = {}