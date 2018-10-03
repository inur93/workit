import blue from '@material-ui/core/colors/blue';
import {red, green} from '@material-ui/core/colors';
import {createMuiTheme} from "@material-ui/core/styles/index";

const drawerWidth = 340;

export const themes = {
    defaultTheme: createMuiTheme({
        palette: {
            primary: {
                main: blue[700]//'#1d72ff'
            }, //
            secondary: {
                main: blue[100]//'#ace7ff'
            }, //
        },
    }),
    greenTheme: createMuiTheme({
        palette: {
            primary: {
                main: green[700]//'#1d72ff'
            }, //
            secondary: {
                main: green[100]
            }, //
        },
    }),
    redTheme: createMuiTheme({
        palette: {
            primary: {
                main: red[700]//'#1d72ff'
            }, //
            secondary: {
                main: red[100]
            }, //
        },
    })
};

export const styles = theme => (
    {
        root: {
            flexGrow: 1,
        },
        flex: {
            flex: 1,
        },
        toolbar: {
            backgroundColor: theme.palette.primary.main,
            paddingLeft: '0px'
        },
        toolbarOpen: {
            paddingLeft: '24px'
        },
        toolbarTitle: {
            flex: 1,
            marginLeft: 20,
            color: "#FFF"
        },
        formControl: {
            margin: theme.spacing.unit,
            minWidth: 120,
            maxWidth: 300,
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: theme.spacing.unit / 4,
        },
        selectEmpty: {
            marginTop: theme.spacing.unit * 2,
        },
        menuButton: {
            color: theme.palette.primary,
            marginLeft: 12,
            /*        marginLeft: -12,
                    marginRight: 20,*/
        },
        addIcon: {
            position: 'absolute',
            top: theme.spacing.unit * 12,

            /*bottom: theme.spacing.unit * 4,*/
            right: theme.spacing.unit * 6,

        },

        appFrame: {
            zIndex: 1,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            width: '100%',
        },
        appBar: {
            position: 'absolute',
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: drawerWidth
        },
        hide: {
            display: 'none',
        },
        drawerPaper: {
            position: 'relative',
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 8px',
            ...theme.mixins.toolbar,
        },
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing.unit * 3,
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        'content-left': {
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        'contentShift-left': {
            marginLeft: 0,
        },

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
            '&:hover':{
                '.editable-field-content': {
                    border: '1px dashed black'
                }
            }
        }
    });

export const switchStyles = {
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
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};