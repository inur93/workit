import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, observable, reaction} from "mobx";
import {Icon, IconButton, ListItem, ListItemText, ListItemIcon, List, Collapse} from "@material-ui/core";
import {withStyles} from '@material-ui/core/styles';


const iconSize = 24;
const styles = theme => ({
    tree: {
        paddingTop: 0,
        paddingBottom: 0,
        maxHeight: "calc(100vh - 150px)",
        overflowY: "auto",
        overflowX: "hidden"
    },
    treeNodeContainer: {
        '&:hover': {
            backgroundColor: theme.palette.secondary.light
        },
        '&.active': {
            backgroundColor: theme.palette.primary.light,
            '& span': {
                color: '#fff'
            }
        },
    },
    treeNode: {
        paddingTop: 4,
        paddingBottom: 4,


    },
    treeIcon: {
        marginRight: 0
    },
    treeNodeText: {
        paddingLeft: 0,
        '&:hover': {
            cursor: 'pointer',
        },
    },

})

class TreeNode extends Component {

    expanded = false;
    hasChildren = true;

    constructor(props) {
        super(props);
        this.expanded = "true" === localStorage.getItem(`expanded-${props.node.id}`);//(props.node[props.childProp] || []).length > 0;
        this.hasChildren = props.hasChildren;
        reaction(() => this.expanded, (expanded) => {
            /*this.props.store.getElements(this.props.)*/
            if (this.props.childElements(this.props.node).length === 0) this.hasChildren = false;
        })
    }

    toggleExpand = () => {
        const expand = !this.expanded;
        this.expanded = expand;
        localStorage.setItem(`expanded-${this.props.node.id}`, `${expand}`);
    }

    onSelect = () => {
        this.props.onSelect(this.props.node);
    }

    onEdit = () => {
        this.props.onEdit(this.props.node);
    }

    render() {
        const {nameProp, matchingProp, childElements, selected, node, margin, editable, classes} = this.props;
        const active = selected && (selected[matchingProp] === node[matchingProp]);
        const marginSum = margin + (this.props.hasChildren ? 0 : iconSize);
        return (
            <div>
                <div className={[classes.treeNodeContainer, active && "active"].join(' ')}>
                    <ListItem style={{marginLeft: `${marginSum}px`}} className={[classes.treeNode].join(' ')}>
                        {this.props.hasChildren &&
                        <ListItemIcon className={classes.treeIcon}>
                            <IconButton variant="fab"
                                        size="small"
                                        aria-label="add"
                                        style={{
                                            display: "inline-block",
                                            width: `${iconSize}px`,
                                            height: `${iconSize}px`
                                        }}
                                        onClick={() => {
                                            this.toggleExpand()
                                        }}>
                                <Icon>{this.expanded ? "remove" : "add"}</Icon>
                            </IconButton>
                        </ListItemIcon>
                        }
                        <ListItemText onClick={this.onSelect} className={classes.treeNodeText}
                                      primary={node[nameProp]}/>
                    </ListItem>
                </div>
                {this.props.hasChildren &&
                <Collapse in={this.expanded}>
                    <List className={classes.tree}>
                        {childElements(node).map(child => <TreeNode {...this.props}
                                                                    key={child[nameProp]}
                                                                    margin={this.props.margin + 15}
                                                                    node={child}/>)}
                    </List>
                </Collapse>
                }
            </div>)
    }
}

export default withStyles(styles, {withTheme: true})(observer(TreeNode));

TreeNode.propTypes = {
    node: PropTypes.object,
    margin: PropTypes.number,
    selected: PropTypes.object,
    matchingProp: PropTypes.string,
    childProp: PropTypes.string,
    nameProp: PropTypes.string,
    childElements: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    onEdit: PropTypes.func,
    hasChildren: PropTypes.bool
}

TreeNode.defaultProps = {
    margin: 0,
    matchingProp: "id",
    childProp: "children",
    nameProp: "name",
    editable: false,
    hasChildren: true
}

decorate(TreeNode, {
    expanded: observable,
})