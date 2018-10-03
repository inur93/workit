/**
 * Created by Christian on 03-08-2017.
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types';

import '../../styles/css/checkboxcomp.css'
import {D} from "../cms/Editable";

export default class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uuid: Math.floor(Math.random() * 1000000000),
            checked: props.checked
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            checked: newProps.checked
        })
    }

    handleCheck = (e) => {
        if(this.props.disabled) return;
        let checked = e.target.checked;
        if (this.props.onSelect) {
            this.props.onSelect(checked);
        }

    };

    render() {
        return (
            <div>
                <div className="checkbox-md">
                    <input type="checkbox"
                           value="None"
                           id={this.state.uuid}
                           name="check"
                           onChange={this.handleCheck}
                           checked={this.state.checked}
                           defaultChecked={this.props.defaultChecked}/>
                    <label htmlFor={this.state.uuid} disabled={this.props.disabled}/>

                </div>
                {this.props.text &&
                <label onClick={this.handleCheck} style={{fontWeight: "inherit"}}>{D(this.props.text)}</label>
                }
            </div>
        )
    }
}

Checkbox.propTypes = {
    checked: PropTypes.bool,
    onCheck: PropTypes.func,
    defaultChecked: PropTypes.bool,
    text: PropTypes.string,
    disabled: PropTypes.bool
}

Checkbox.
defaultProps = {
    checked: false,
    disabled: false,
    onCheck: ()=>{console.log('Checkbox: onCheck not set'); this.checked = !this.checked}

}
