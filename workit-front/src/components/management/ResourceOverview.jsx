import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import ResourceNode from "./ResourceNode";
import ResourceStore from "../../stores/ManagementStore";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    resourceOverview: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginLeft: '5px',
        marginRight: '5px',
        background: '#dbeef4',
        boxShadow: '2px 3px 10px #e1e1e1'
    },
    resourceOverviewTitle: {
        fontWeight: 'bold',
        paddingTop: '3px',
        paddingBottom: '3px'
    }
})

class ResourceOverview extends Component {


    constructor(props) {
        super(props);
    }


    render() {
        const {store, classes} = this.props;
        const {resources} = this.props.store;
        return (
            <div className={classes.resourceOverview}>
                <div className={classes.resourceOverviewTitle}>
                    Resources
                </div>
                <div>
                    {resources.map(resource => <ResourceNode key={resource.name} resource={resource} store={store}/>)}
                </div>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(ResourceOverview));

ResourceOverview.propTypes = {
    store: PropTypes.instanceOf(ResourceStore)
}
