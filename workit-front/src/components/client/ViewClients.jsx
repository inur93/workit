import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import ClientList from "../lists/ClientList";
import Grid from "@material-ui/core/Grid/Grid";
import CustomButton from "../shared/CustomButton";
import {Link} from "react-router-dom";
import {Links} from "../../config/Links";
import {Title} from "../shared/SimpleComponents";
import ClientStore from "../../stores/ClientStore";
import Perm from "../management/Perm";
import {Policies} from "../../config/Policies";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import Error from "../shared/Error";

const styles = theme => ({}
);

class ViewClients extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        const {isLoading, hasError, error} = this.props.clientStore.status.clientList;
        if(hasError) return <Error message={error} />;
        return (
            <Grid container spacing={16} direction={"column"}>
                <Grid item>
                    <Title>Clients</Title>
                </Grid>
                <Perm permissions={Policies.admin()}>
                    <Grid item>
                        <Grid container spacing={8}>
                            <Grid item>
                                <CustomButton variant="raised" color="primary" component={Link}
                                              to={Links.createClient()}>New client</CustomButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Perm>
                <Grid item>
                    {isLoading && <LinearProgress color="secondary" />}
                    <ClientList store={this.props.clientStore}/>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles, {withTheme: true})(inject("clientStore")(observer(ViewClients)));

decorate(ViewClients, {});

ViewClients.propTypes = {
    clientStore: PropTypes.instanceOf(ClientStore)
};

ViewClients.defaultProps = {};