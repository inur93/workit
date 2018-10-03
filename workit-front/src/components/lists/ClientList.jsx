import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {action, decorate} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import ClientStore from "../../stores/ClientStore";
import {withRouter} from "react-router-dom";
import {Links} from "../../config/Links";
import EnhancedTable from "../tables/EnhancedTable";

const styles = theme => ({}
);

class ClientList extends Component {

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        this.props.store.reloadClients();
    }

    onOrderingChange = (orderBy, order) => {
        this.props.store.paging.orderBy = orderBy;
        this.props.store.paging.order = order;
    };

    render() {
        const {page, pageSize, order, orderBy, count} = this.props.store.paging;
        const {clients} = this.props.store;
        return (
            <EnhancedTable dataHandler={this.fetchCases}
                           rows={clients}
                           page={page}
                           pageSize={pageSize}
                           order={order}
                           orderBy={orderBy}
                           rowsCount={count}
                           onPageChange={p => this.props.store.paging.page = p}
                           onPageSizeChange={s => this.props.store.paging.pageSize = s}
                           onOrderingChange={this.onOrderingChange}
                           columns={[
                               {name: "Client", key: "name", link: c => Links.client(c.id)},
                               {name: "ID", key: "id", link: c => Links.client(c.id)}
                           ]}/>
        )
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(observer(ClientList)));

decorate(ClientList, {
    onOrderingChange: action
});

ClientList.propTypes = {
    store: PropTypes.instanceOf(ClientStore)
};

ClientList.defaultProps = {};