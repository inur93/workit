import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel,
    Paper
} from '@material-ui/core';
import FieldsTableHeader from "./FieldsTableHeader";
import Editable from "./Editable";

const styles = theme => ({
        root: {
            width: '100%',
            marginTop: theme.spacing.unit * 3,
        },
        table: {
            minWidth: 1020,
        },
        tableWrapper: {
            overflowX: 'auto',
        },
    }
);

class FieldsTable extends Component {

    orderBy;
    order;
    selected = [];
    page = 0;
    rowsPerPage = 5;

    constructor(props) {
        super(props);
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.orderBy === property && this.order === 'desc') {
            order = 'asc';
        }

        this.order = order;
        this.orderBy = orderBy;
    };

    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.selected = this.props.data.map(d => d.id);
            return;
        }
        this.selected = [];
    };

    handleClick = (event, id) => {
        const {selected} = this;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.selected = newSelected;
    };

    handleChangePage = (event, page) => {
        this.page = page;
    };

    handleChangeRowsPerPage = event => {
        this.rowsPerPage = event.target.value;
    };

    isSelected = id => this.selected.indexOf(id) !== -1;

    getSorting(order, orderBy) {
        return order === 'desc'
            ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
            : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
    }

    render() {
        const {classes, data} = this.props;
        const {orderBy, order, selected, rowsPerPage, page} = this;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>

                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <FieldsTableHeader
                            numSelected={selected.length}
                            columns={[{
                                id: 'name',
                                numeric: false,
                                disablePadding: true,
                                label: <Editable field={"name"}/>
                            },]}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {data
                                .sort(this.getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    const isSelected = this.isSelected(n.id);
                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => this.handleClick(event, n.id)}
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={n.id}
                                            selected={isSelected}
                                        >
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.name}
                                            </TableCell>

                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{height: 49 * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
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
            </Paper>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(FieldsTable));

decorate(FieldsTable, {
    handleRequestSort: action,
    handleSelectAllClick: action,
    handleChangePage: action,
    handleChangeRowsPerPage: action,
    handleClick: action,

    orderBy: observable,
    order: observable,
    selected: observable,
    page: observable,
    rowsPerPage: observable
});

FieldsTable.propTypes = {
    data: PropTypes.array
};

FieldsTable.defaultProps = {};