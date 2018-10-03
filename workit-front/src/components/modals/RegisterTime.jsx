import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import CustomButton from "../shared/CustomButton";
import Transition from "react-transition-group/Transition";
import Editable from "../cms/Editable";
import CustomTextField from "../shared/CustomTextField";
import Grid from "@material-ui/core/Grid/Grid";
import {Util} from "../../index";

const styles = theme => ({}
);

class RegisterTime extends Component {

    date = "";
    hours = 0;
    constructor(props) {
        super(props);
        this.date = Util.formatDateEnglish(new Date());
    }

    register = () => {
        this.props.register({
            date: new Date(this.date).getTime(),
            hours: this.hours
        });
    };

    handleDateChanged = (e) => {
        this.date = e.target.value;
    };

    handleHoursChanged = (e) => {
        this.hours = Number.parseInt(e.target.value);
    }

    render() {
        const {handleClose, open} = this.props;
        return (
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="register-time-title"
                aria-describedby="register-time-description"
            >
                <DialogTitle id="register-time-title">
                    <Editable field={"Register time"}/>
                </DialogTitle>
                <DialogContent>
                    <Grid container direction={"column"}>
                        <Grid item>
                            <CustomTextField type="date" label="Date"
                                             onChange={this.handleDateChanged}
                                             value={this.date}
                                             InputLabelProps={{shrink: true}}/>
                        </Grid>
                        <Grid item>
                            <CustomTextField onChange={this.handleHoursChanged} type="number" label="Hours"/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <CustomButton onClick={handleClose} color="primary">
                        Cancel
                    </CustomButton>
                    <CustomButton onClick={this.register} variant="raised" color="primary">
                        Register
                    </CustomButton>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(RegisterTime));

decorate(RegisterTime, {
    date: observable,
    hours: observable
});

RegisterTime.propTypes = {
    handleClose: PropTypes.func,
    register: PropTypes.func,
    open: PropTypes.bool
};

RegisterTime.defaultProps = {}