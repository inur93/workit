import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import EnhancedTable from "../tables/EnhancedTable";
import {Links} from "../../config/Links";
import CaseStore from "../../stores/CaseStore";

const styles = theme => ({}
);

class CaseList extends Component {

    constructor(props) {
        super(props);
    }

    fetchCases = (page, pageSize, order) => {
        return this.props.fetchCases(page, pageSize, order);
    };

    onOrderingChange = (orderBy, order) => {
        this.props.store.paging.orderBy = orderBy;
        this.props.store.paging.order = order;
    };

    render() {
        const {page, pageSize, order, orderBy, count} = this.props.store.paging;
        const {cases} = this.props.store;
        return (
            <div>
                <EnhancedTable dataHandler={this.fetchCases}
                               rows={cases}
                               page={page}
                               pageSize={pageSize}
                               order={order}
                               orderBy={orderBy}
                               rowsCount={count}
                               onPageChange={p => this.props.store.paging.page = p}
                               onPageSizeChange={s => this.props.store.paging.pageSize = s}
                               onOrderingChange={this.onOrderingChange}
                               columns={[
                                   {name: "ID", key: "id"},
                                   {name: "Title", key: "title", link: c => Links.viewCase(c.projectId, c.id)},
                                   {name: "Status", key: "status"},
                                   {name: "Priority", key: "priority"},
                                   {name: "Responsible", key: "responsible.email"},
                                   {name: "Estimate", key: "estimate"},
                                   {name: "Time spent", key: "timeSpent"},
                               ]}/>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(CaseList));

decorate(CaseList, {
    onOrderingChange: action
});

CaseList.propTypes = {
    store: PropTypes.object
};

CaseList.defaultProps = {
    cases: []
};