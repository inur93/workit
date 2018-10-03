import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import TreeNode from "./TreeNode";
import {FormControl, InputLabel, Select, MenuItem, Grid, List, CircularProgress, LinearProgress} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
        maxWidth: 300,
    }
})

class Tree extends Component {


    constructor(props) {
        super(props);
    }


    render() {
        const {selectedView, views, title, nodes, selected, isLoading, options, classes} = this.props;
        return (
            <div >
                <div >
                    <FormControl className={classes.formControl} fullWidth>
                        {(views.length > 1) && <InputLabel htmlFor="management-view">View</InputLabel>}
                        {(views.length > 1) && <Select
                            value={selectedView}
                            onChange={this.props.onChangeView}
                            inputProps={{
                                name: 'view',
                                id: 'management-view',
                            }}
                        >
                            {views.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)};
                        </Select>}
                        {(views.length === 1) &&
                        <p>{selectedView}</p>
                        }
                    </FormControl>
                </div>
                <div>

                    {/*{ isLoading && <CircularProgress color="secondary" />}*/}
                    { isLoading && <LinearProgress color="secondary" />}
                    <List className={classes.tree}>
                    {nodes.map(node => <TreeNode {...options} key={node.id} node={node} selected={selected}/>)}
                    </List>
                </div>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(Tree));

Tree.propTypes = {
    isLoading: PropTypes.bool,
    nodes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    title: PropTypes.string,
    selected: PropTypes.object,
    selectedView: PropTypes.string,
    onChangeView: PropTypes.func,
    views: PropTypes.array,

    options: PropTypes.shape({
        hasChildren: PropTypes.bool,
        matchingProp: PropTypes.string,
        childProp: PropTypes.string,
        nameProp: PropTypes.string,
        childElements: PropTypes.func,
        onSelect: PropTypes.func.isRequired,
        editable: PropTypes.bool,
        onEdit: PropTypes.func
    })
}

Tree.defaultProps = {
    title: "Tree"
}
