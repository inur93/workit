import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {observer} from "mobx-react";
import {CircularProgress, LinearProgress} from '@material-ui/core';
import {decorate, observable} from "mobx";
import TableRow from "./tableview/TableRow";


const styles = theme => ({
    permissionOverview: {
        position: 'relative',

        '& $header': {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: '400',
            paddingTop: '3px',
            paddingBottom: '3px',
            marginLeft: '5px',

            '& > div': {
                display: 'inline-block',
                width: '75px'
            },
            '& :first-child': {
                width: 'auto',
                textAlign: 'left'
            }
        },
        '& $body': {
            overflowY: 'auto',

            '& ul': {
                position: 'relative',
                listStyle: 'none',
                paddingLeft: '32px',
                '& > li:last-child::after': {
                    height: '27px'
                }
            },
            '& li': {
                textAlign: 'left',
                position: 'relative',
                '&::before, &::after': {
                    content: '""',
                    position: 'absolute',
                    left: '-12px'
                },
                '&::before': {
                    borderTop: '1px solid #000',
                    top: '28px',
                    width: '8px',
                    height: '0px'
                },
                '&::after': {
                    borderLeft: '1px solid #000',
                    height: '100%',
                    width: '0px',
                    top: '2px'
                }
            }
        }
    },
    header: {},
    body: {}

    /*
    ul {
      position: relative;
      list-style: none;
      padding-left: 32px;

      > li:last-child::after {
        height: 27px;
      }
    }

    li {
      text-align: left;
      position: relative;
      &::before, &::after {
        content: "";
        position: absolute;
        left: -12px;
      }
      &::before {
        border-top: 1px solid #000;
        top: 28px;
        width: 8px;
        height: 0;
      }

      &::after {
        border-left: 1px solid #000;
        height: 100%;
        width: 0px;
        top: 2px;
      }
    }
    */

})

class TableOverview extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            title,
            permissions,
            list,
            selected,
            rowOptions,
            isLoading,
            classes
        } = this.props;

        return (
            <div className={classes.permissionOverview} style={{width: "100%"}}>

                {/*{ isLoading && <CircularProgress color="secondary" />}*/}
                {isLoading && <div style={{marginTop: '50px'}}><LinearProgress color="secondary"/></div>}
                <div className={classes.header}>
                    <div style={{width: `calc(100% - ${permissions.length * 75}px)`}}>{title}</div>
                    {permissions.map(permission => <div key={permission.id}>{permission.name}</div>)}
                </div>
                <div className={classes.body}>
                    <ul>
                        {
                            list.map(element => {
                                return <TableRow {...rowOptions}
                                                 key={element.id}
                                                 selected={selected}
                                                 element={element}
                                                 permissions={permissions}
                                />
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

export default (withStyles(styles, {withTheme: true})(observer(TableOverview)));


TableOverview.propTypes = {

    classes: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    title: PropTypes.string,
    onSelectElement: PropTypes.func,
    onUpdateElement: PropTypes.func,
    onDeleteElement: PropTypes.func,


    permissions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),

    list: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    selected: PropTypes.object,

    rowOptions: PropTypes.shape({
        onEdit: PropTypes.func,
        elementSelectable: PropTypes.bool,
        childProp: PropTypes.string,
        hasPermission: PropTypes.func,
        isPermissionAvailable: PropTypes.func,
        onUpdatePermission: PropTypes.func,
    })
}

TableOverview.defaultProps = {
    title: "list"
}

decorate(TableOverview, {
    selectedRole: observable
})
