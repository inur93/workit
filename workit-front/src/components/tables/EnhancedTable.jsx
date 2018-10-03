import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed, autorun, transaction} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import Table from "@material-ui/core/Table/Table";
import EnhancedTableHead from "./EnhancedTableHead";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import TableCell from "@material-ui/core/TableCell/TableCell";
import {Link} from "react-router-dom";

const styles = theme => ({}
);

class EnhancedTable extends Component {

    constructor(props) {
        super(props);

    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.props.orderBy === property && this.props.order === 'desc') {
            order = 'asc';
        }

        this.props.onOrderingChange(orderBy, order);
    };


    handleChangePage = (event, page) => {
        this.props.onPageChange(page);
    };

    handleChangeRowsPerPage = event => {
        this.props.onPageSizeChange(event.target.value);
    };

    render() {
        const {classes, columns} = this.props;
        const {order, orderBy, pageSize, page, rows, rowsCount} = this.props;
        const emptyRows = pageSize - Math.min(pageSize, rowsCount - page * pageSize);
        return (
            <div>
                <Table className={classes.table} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={this.handleSelectAllClick}
                        onRequestSort={this.handleRequestSort}
                        rowCount={rowsCount}
                        columns={columns}
                    />
                    <TableBody>
                        {rows.map(row =>
                            <TableRow hover tabIndex={-1} key={row.id}>
                                {columns.map(col => {
                                    let keys = col.key.split(".");
                                    let value = row;
                                    keys.forEach(key => {
                                        if (value) value = value[key];
                                    });
                                    if (col.link) {
                                        return <TableCell key={col.name}>
                                            <Link to={col.link(row)}>{value}</Link>
                                        </TableCell>;
                                    } else {
                                        return <TableCell key={col.name}
                                                          numeric={col.numeric}>{value}</TableCell>;
                                    }
                                })}
                            </TableRow>
                        )}

                        {emptyRows > 0 && (
                            <TableRow style={{height: 49 * emptyRows}}>
                                <TableCell colSpan={columns.length}/>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={rowsCount}
                    rowsPerPage={pageSize}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(EnhancedTable));

decorate(EnhancedTable, {
    handleRequestSort: action,
    handleChangePage: action,
    handleChangeRowsPerPage: action
});

EnhancedTable.propTypes = {
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    dataHandler: PropTypes.func,
    onPageChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onOrderingChange: PropTypes.func,

    page: PropTypes.number,
    pageSize: PropTypes.number,
    orderBy: PropTypes.string,
    order: PropTypes.string,
    rowsCount: PropTypes.number,
};

EnhancedTable.defaultProps = {};