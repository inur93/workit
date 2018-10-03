import PropTypes from "prop-types";
import React, {Component} from 'react';
import {decorate, observable} from "mobx";
import {observer} from "mobx-react";
import {Icon, IconButton, Switch, Tooltip} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles/index";
import {green, red} from "@material-ui/core/colors/index";

const iconSize = 24;

const styles = theme => ({
    switchBase: {
        color: red[500],
        '& + $bar': {
            backgroundColor: red[500]
        },
        '&$checked': {
            color: green[500],
            '& + $bar': {
                backgroundColor: green[500],
            },
        },
    },
    bar: {},
    checked: {},

    editableField: {
        '&:hover': {
            '.editable-field-content': {
                border: '1px dashed black'
            }
        }
    },

    roleRow: {
        minHeight: '50px',
        '& $text': {
            cursor: 'pointer',
            marginTop: '20px',
            marginBottom: '10px',
            '&$selectable': {
                '&:hover': {
                    color: theme.palette.primary.main
                }
            }
        },
        '& $permissions': {
            float: 'right',
            '& > div': {
                width: '75px',
                display: 'inline-block'
            }
        }
    },
    text: {},
    selectable: {},
    permissions: {},
    rowContent: {
        display: 'inline-block',
        width: '100%',
        '& > div': {
            display: 'inline-block'
        }
    }
})

class TableRow extends Component {

    expanded = false;

    constructor(props) {
        super(props);
    }

    toggleExpand = () => {
        this.expanded = !this.expanded;
    }

    render() {

        const {
            element,
            selected,
            permissions,
            classes,
            onEdit,
            onUpdatePermission,
            hasPermission,
            isPermissionAvailable,
            childProp,
            elementSelectable,
        } = this.props;

        return (
            <li className={classes.roleRow} key={element.id}>
                <div className={classes.rowContent}>
                    <IconButton variant="fab"
                                size="small"
                                aria-label="add"
                                style={{display: "inline-block", width: `${iconSize}px`, height: `${iconSize}px`}}
                                onClick={() => {
                                    this.toggleExpand()
                                }}>
                        <Icon>{this.expanded ? "arrow_drop_down" : "arrow_right"}</Icon>
                    </IconButton>
                    <div className={[classes.text, elementSelectable && classes.selectable].join(' ')}
                         onClick={() => elementSelectable && onEdit(element)}>{element.name}</div>
                    <div className={classes.permissions}>
                        {
                            permissions.map(permission => {
                                const granted = hasPermission(element, selected, permission);
                                const checked = !!granted;
                                const inherits = granted !== true && granted !== false && granted !== null;
                                const available = isPermissionAvailable(element, selected, permission);
                                //!!(permissionValues[role.id][permission.id]);
                                const sw = <Switch
                                    key={`${element.id}-${permission.id}-switch`}
                                    checked={!!(available && checked)}
                                    disabled={!available}
                                    value={"" + permission.id}
                                    onChange={(evt, checked) => {
                                        if (!inherits) onUpdatePermission(element, selected, permission, checked);
                                    }}
                                    classes={{
                                        switchBase: classes.switchBase,
                                        bar: classes.bar,
                                        checked: classes.checked
                                    }}
                                />;

                                return <div key={`${element.id}-${permission.id}`}>
                                    {inherits ?
                                        <Tooltip key={`${element.id}-${permission.id}-tooltip`}
                                                 title={`Access is inherited from '${granted}'`}
                                                 placement="top"
                                                 id={`${element.id}-${permission.id}-tooltip`}>
                                            {sw}
                                        </Tooltip> :
                                        sw
                                    }
                                </div>
                            })}
                    </div>
                    {
                        this.expanded &&
                        <ul>
                            {element[childProp].map(el => <TableRow {...this.props} key={el.id}
                                                                    element={el}/>)}
                        </ul>
                    }
                </div>
            </li>)
    }

}

export default withStyles(styles, {withTheme: true})(observer(TableRow));

TableRow.propTypes = {
    classes: PropTypes.object.isRequired,
    element: PropTypes.object,
    elementSelectable: PropTypes.bool,
    selected: PropTypes.object,
    permissions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),

    onEdit: PropTypes.func,
    onUpdatePermission: PropTypes.func,
    hasPermission: PropTypes.func,
    isPermissionAvailable: PropTypes.func,

    childProp: PropTypes.string,
};

TableRow.defaultProps = {
    childProp: "children",
    elementSelectable: false,
};

decorate(TableRow, {
    expanded: observable
})