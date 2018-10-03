import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import ResourceOverview from "./ResourceOverview";
import ResourceStore from "../../stores/ManagementStore";
import {decorate, observable, reaction} from "mobx";
import {Icon, IconButton} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";

const iconSize = 24;

const styles = theme => ({
    resourceNode: {
        display: 'block',
        textAlign: 'left',
        width: '100%',
        marginRight: '5px',
        '& $text': {
            display: 'inlineBlock',
            paddingBottom: '3px',
            paddingTop: '3px',
            verticalAlign: 'text-top',
        },
        '& $active': {
            backgroundColor: theme.palette.primary.light
        },
        '& $content': {
            '&:hover': {
                backgroundColor: theme.palette.primary,
                cursor: 'pointer'
            }
        }
    },
    text: {},
    active: {},
    content: {}
});

class ResourceNode extends Component {

    expanded = false;
    hasChildren = true;

    constructor(props) {
        super(props);
        this.expanded = (props.resource.subResources || []).length > 0;
        reaction(() => this.expanded, (expanded) => {
            /*this.props.store.getElements(this.props.)*/
            if (this.props.resource.subResources.length === 0) this.hasChildren = false;
        })
    }

    toggleExpand = () => {
        this.expanded = !this.expanded;
    }

    render() {
        const {currentResource} = this.props.store;
        const active = currentResource && (currentResource.name === this.props.resource.name);
        const margin = this.props.margin + (this.hasChildren ? 0 : iconSize);
        const {classes} = this.props;
        return (
            <div className={classes.resourceNode}>
                <div className={[classes.content, active && classes.active].join(' ')}>
                    <div style={{marginLeft: `${margin}px`}}>
                        {this.hasChildren &&
                        <IconButton variant="fab"
                                    size="small"
                                    aria-label="add"
                                    style={{display: "inline-block", width: `${iconSize}px`, height: `${iconSize}px`}}
                                    onClick={() => {
                                        this.toggleExpand()
                                    }}>
                            <Icon>{this.expanded ? "remove" : "add"}</Icon>
                        </IconButton>
                        }
                        <div className={classes.text} style={{width: `calc(100% - ${iconSize}px)`}}
                             onClick={() => this.props.store.currentResource = this.props.resource}>
                            {this.props.resource.name}
                        </div>
                    </div>
                </div>
                {this.expanded &&
                <div>
                    {this.props.resource.subResources.map(resource => <ResourceNode key={resource.name}
                                                                                    margin={this.props.margin + 15}
                                                                                    resource={resource}
                                                                                    store={this.props.store}/>)}
                </div>
                }
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(ResourceNode));

ResourceNode.propTypes = {
    resource: PropTypes.object,
    margin: PropTypes.number,
    store: PropTypes.instanceOf(ResourceStore)
}

ResourceNode.defaultProps = {
    margin: 0
}

decorate(ResourceNode, {
    expanded: observable,
})