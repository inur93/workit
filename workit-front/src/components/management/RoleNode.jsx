import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import ResourceOverview from "./ResourceOverview";
import ResourceStore from "../../stores/ManagementStore";
import {decorate, observable, reaction} from "mobx";
import {Icon, IconButton} from "@material-ui/core";

class RoleNode extends Component {

    constructor(props) {
        super(props);

    }


    render() {
        const roles = [
            {
                name: "Fruit",
                children: [
                    {
                        name: "Red",
                        children: [
                            {
                                name: "Cherry"
                            },
                            {
                                name: "Strawberry"
                            }]
                    },
                    {
                        name: "yellow",
                        children: [
                            {
                                name: "Banana"
                            }
                        ]
                    }
                ]
            },
            {
                name: "Meat",
                children: [
                    {
                        name: "Beef"
                    },
                    {
                        name: "Pork"
                    }
                ]
            }
        ]
        return (
            <div>
                <div className="role-tree">
                    <ul>
                        {roles.map(r => <Row key={r.name} role={r}/>)}
                    </ul>
                </div>
                <div className="test">
                    <div className="clt">
                        <ul>
                            <li>
                                Fruit
                                <ul>
                                    <li>
                                        Red
                                        <ul>
                                            <li>Cherry</li>
                                            <li>Strawberry</li>
                                        </ul>
                                    </li>
                                    <li>
                                        Yellow
                                        <ul>
                                            <li>Banana</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Meat
                                <ul>
                                    <li>Beef</li>
                                    <li>Pork</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export const Row = ({role}) => {
    return (
        <li>
            <div>
            {role.name}
            </div>
            <ul>
                {(role.children || []).map(child => <Row key={child.name} role={child}/>)}
            </ul>
        </li>)
}

export default observer(RoleNode)

RoleNode.propTypes = {
    role: PropTypes.object,
    store: PropTypes.instanceOf(ResourceStore)
}

RoleNode.defaultProps = {}

decorate(RoleNode, {})