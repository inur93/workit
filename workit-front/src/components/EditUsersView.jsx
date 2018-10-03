/*
import React, {Component} from 'react';
import {observer} from "mobx-react";
import {Button, Col, Grid, Row} from "react-bootstrap";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";
import {withRouter} from "react-router-dom";
import Spinner from "./shared/Spinner";
import EditUserModal from "./EditUserModal";

class EditUsersView extends Component {

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.props.stores.UserStore.setCurrentQuery("");
    }

    formatModalLink = (val,row)=>{
            return <Button onClick={()=>this.props.stores.UserStore.editUser(val)}>Rediger Bruger</Button>

    }


    onPageChange = (page, sizePerPage)=>{
        this.props.stores.UserStore.setCurrentPage(page, this.props.data);
    };

    onSearchChange = (searchText, colInfos, multiColumnSearch)=>{
        this.props.stores.UserStore.setCurrentQuery(searchText, this.props.data);
    };


    render() {
        const stores = this.props.stores;
        const ModalUser = stores.UserStore.currentUser;
        return (
            <Grid>
                {stores.UserStore.inProgress && <Spinner size={"sm"}/>}
                <Button onClick={()=>this.props.stores.UserStore.newUser({roles:[stores.UserStore.roles[0]]})}>Ny Bruger</Button>
                <Row>
                    <Col>
                        <BootstrapTable remote pagination search multiColumnSearch
                                         data={stores.UserStore.users.toJSON()}
                                         fetchInfo={{dataTotalSize:stores.UserStore.noUsers}}
                                         options={{
                                             sizePerPage :10,
                                             sizePerPageList: [10],
                                             page: stores.UserStore.curPage+1,
                                             onPageChange: this.onPageChange,
                                             onSearchChange: this.onSearchChange,
                                             clearSearch: true
                                        }}>
                            <TableHeaderColumn dataField={'username'}>Brugernavn</TableHeaderColumn>
                            <TableHeaderColumn dataField={'firstname'}>Fornavn</TableHeaderColumn>
                            <TableHeaderColumn dataField={'lastname'}>Efternavn</TableHeaderColumn>
                            <TableHeaderColumn dataField={'email'}>Email</TableHeaderColumn>
                            <TableHeaderColumn dataField={'roles'} >Roller</TableHeaderColumn>
                            <TableHeaderColumn isKey dataField={'id'} dataFormat={this.formatModalLink}>Rediger</TableHeaderColumn>
                        </BootstrapTable>

                    </Col>
                </Row>
                {ModalUser && <EditUserModal cancelEdit={stores.UserStore.cancelEdit}
                                             saveUser={stores.UserStore.saveUser}
                                             deleteUser={stores.UserStore.deleteUser}
                                             user={ModalUser}
                                             roles={stores.UserStore.roles}
                />}

            </Grid>
        )
    }

}



export default withRouter(observer(EditUsersView));
EditUsersView.propTypes = {};

EditUsersView.defaultProps = {};*/
