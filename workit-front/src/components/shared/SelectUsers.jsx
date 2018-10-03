import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {action, decorate, observable} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Chip from "@material-ui/core/Chip/Chip";
import Paper from "@material-ui/core/Paper/Paper";
import CreateClientUser from "../modals/CreateClientUser";
import NoSsr from "@material-ui/core/NoSsr/NoSsr";
import CreatableSelect from "react-select/lib/AsyncCreatable";
import NonCreatebleSelect from "react-select/lib/Async";
import {emphasize} from '@material-ui/core/styles/colorManipulator';
import Typography from "@material-ui/core/Typography/Typography";
import classNames from 'classnames';
import UserStore from "../../stores/UserStore";
import {D} from "../cms/Editable";


const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 250,
    },
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    divider: {
        height: theme.spacing.unit * 2,
    }
});

function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function inputComponent({inputRef, ...props}) {
    return <div ref={inputRef} {...props} />;
}

function Control(props) {

    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}


function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function SingleValue(props) {
    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

function MultiValue(props) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={classNames(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            onDelete={event => {
                props.removeProps.onClick();
                props.removeProps.onMouseDown(event);
            }}
        />
    );
}

function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    SingleValue,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    ValueContainer,
};

class SelectUsers extends Component {

    query = "";
    newUserDefaultValue = "";
    showCreateUser = false;
    showMenu = false;

    constructor(props) {
        super(props);
    }

    handleChange = (selected, action) => {
        if (action.action === 'create-option') {
            this.newUserDefaultValue = selected.splice(selected.length - 1, 1)[0].value;
            this.showCreateUser = true;
        } else {
            if (this.props.multiple) {
                this.props.onUsersChanged(selected.map(s => s.data));
            } else {
                this.props.onUsersChanged(selected.data);
            }
        }
    };

    handleInputChange =  (value, action) => {
        this.query = value;
        /*switch(action.action){
            case "input-change":
            case "input-blur":
                this.showMenu = true;
                break;
            case "menu-close":
                this.showMenu = false;
                break;
        }*/
    };

    handleCreateUser = user => {
        this.props.selectedUsers.push(user);
        this.props.onUsersChanged(this.props.selectedUsers);
        this.showCreateUser = false;
    };

    mapUsers = list => {
        return list ? list.map(s => ({data: s, value: s.id, label: `${s.name || "(unknown)"} (${s.email})`})) : [];
    };

    render() {
        const {showCreateUser} = this;
        const {classes, theme, selectedUsers, multiple, label, placeholder, helperText} = this.props;

        const selectStyles = {
            input: base => ({
                ...base,
                color: theme.palette.text.primary,
            }),
        };

        const {enableAdd, disabled} = this.props;

        const props = {
            cacheOptions: true,
            defaultOptions: true,
            isDisabled: disabled,
            loadOptions: query => this.props.getUserSuggestions(query)
                .then(users => this.mapUsers(users)),
            components: components,
            placeholder: D(placeholder),
            textFieldProps: {
                label: D(label),
                helperText: D(helperText),
                InputLabelProps: {
                    shrink: true,
                },
            },
            value: this.mapUsers(selectedUsers),
            classes: classes,
            styles: selectStyles,
            isMulti: multiple,
            menuIsOpen: this.showMenu,
            onInputChange: this.handleInputChange,
            onChange: this.handleChange,
            onMenuOpen: () => this.showMenu = true,
            onMenuClose: () => this.showMenu = false
        };
        return (
            <div>
                {showCreateUser &&
                <CreateClientUser open={showCreateUser}
                                  defaultValue={this.newUserDefaultValue}
                                  onClose={() => this.showCreateUser = false}
                                  store={this.props.store}
                                  onCreate={this.handleCreateUser}/>
                }
                <NoSsr>
                    {enableAdd ?
                        <CreatableSelect {...props} /> :
                        <NonCreatebleSelect {...props} />
                    }
                </NoSsr>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(SelectUsers));

decorate(SelectUsers, {
    query: observable,
    showMenu: observable,
    newUserDefaultValue: observable,
    showCreateUser: observable,
    handleChange: action,
    handleInputChange: action
});

SelectUsers.propTypes = {
    disabled: PropTypes.bool,
    store: PropTypes.instanceOf(UserStore),
    getUserSuggestions: PropTypes.func.isRequired,
    onUsersChanged: PropTypes.func.isRequired,
    selectedUsers: PropTypes.array.isRequired,
    enableAdd: PropTypes.bool,
    multiple: PropTypes.bool,
    label: PropTypes.string,
    helperText: PropTypes.string,
    placeholder: PropTypes.string
};

SelectUsers.defaultProps = {
    disabled: false,
    enableAdd: true,
    multiple: true,
    label: "Users",
    placeholder: "Add users..."
};