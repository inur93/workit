import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import TableHead from "@material-ui/core/TableHead/TableHead";
import CustomTableCell from "../shared/CustomTableCell";
import TableCell from "@material-ui/core/TableCell/TableCell";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import TableSortLabel from "@material-ui/core/TableSortLabel/TableSortLabel";
import TableRow from "@material-ui/core/TableRow/TableRow";
import {D} from "../cms/Editable";

const styles = theme => ({}
);

class EnhancedTableHead extends Component {

    constructor(props) {
        super(props);
    }

    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { order, orderBy, columns } = this.props;
        return (
            <TableHead>
                <TableRow>
                    {columns.map(col => {
                        return (
                            <TableCell
                                key={col.key}
                                numeric={col.numeric}
                                sortDirection={orderBy === col.key ? order : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={col.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === col.key}
                                        direction={order}
                                        onClick={this.createSortHandler(col.key)}
                                    >
                                        {D(col.name)}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(EnhancedTableHead));

decorate(EnhancedTableHead, {});

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    columns: PropTypes.array
};

EnhancedTableHead.defaultProps = {};