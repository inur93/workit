import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import TimeRegistrationStore from "../../stores/TimeRegistrationStore";
import Grid from "@material-ui/core/Grid/Grid";
import {Title} from "../shared/SimpleComponents";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import {Link} from "react-router-dom";
import {Links} from "../../config/Links";
import {Util} from "../../index";
import IconButton from "@material-ui/core/IconButton/IconButton";
import NextIcon from '@material-ui/icons/ChevronRight';
import PreviousIcon from '@material-ui/icons/ChevronLeft';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import Error from "../shared/Error";

const styles = theme => ({}
);

const oneDay = 1000*60*60*24;
const oneWeek = oneDay*7;

class TimeRegistration extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.timeRegistrationStore.fetchTimeRegistrations();
    }

    get registrationsMapped() {
        let map = {};
        let rows = [];
        this.props.timeRegistrationStore.timeRegistrations.forEach(t => {
            if (!map[t.caseId]) map[t.caseId] = {
                caseId: t.caseId,
                projectId: t.projectId,
            };
            map[t.caseId][Util.formatDateEnglish(new Date(t.date))] = t.hours;
        });
        return Object.keys(map).sort((a, b) => a - b).map(key => (map[key]));
    }

    nextWeek = () => {
        const {timeRegistrationStore} = this.props;
        timeRegistrationStore.from += oneWeek;
        timeRegistrationStore.to += oneWeek;
        timeRegistrationStore.fetchTimeRegistrations();
    };

    previousWeek = () => {
        const {timeRegistrationStore} = this.props;
        timeRegistrationStore.from -= oneWeek;
        timeRegistrationStore.to -= oneWeek;
        timeRegistrationStore.fetchTimeRegistrations();
    };

    render() {
        const {from, to, isLoading, hasError, error} = this.props.timeRegistrationStore;

        if(!isLoading && hasError) return <Error message={error}/>;
        let dates = [];
        const days = (to - from) / oneDay;
        for (let i = 0; i < days; i++) {
            dates.push(Util.formatDateEnglish(new Date(from + (i * oneDay))));
        }
        return (
            <Grid container spacing={16} direction={"column"}>
                {isLoading && <LinearProgress color="secondary" />}
                <Grid item>
                    <Title>Time registrations</Title>
                </Grid>
                <Grid item>
                    <IconButton onClick={this.previousWeek}>
                        <PreviousIcon/>
                    </IconButton>
                    <IconButton onClick={this.nextWeek}>
                        <NextIcon/>
                    </IconButton>
                </Grid>
                <Grid item>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Case
                                </TableCell>
                                {
                                    dates.map(d => <TableCell key={d}>{d}</TableCell>)
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.registrationsMapped.map(r => <TableRow key={r.caseId}>
                                <TableCell>
                                    <Link to={Links.viewCase(r.projectId, r.caseId)}>{r.caseId}</Link>
                                </TableCell>
                                {dates.map(d => <TableCell key={`${r.caseId}-${d}`}>
                                    {r[d]}
                                </TableCell>)}
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles, {withTheme: true})(inject("timeRegistrationStore")(observer(TimeRegistration)));

decorate(TimeRegistration, {
    registrationsMapped: computed,
    nextWeek: action,
    previousWeek: action
});

TimeRegistration.propTypes = {
    classes: PropTypes.object.isRequired,
    timeRegistrationStore: PropTypes.instanceOf(TimeRegistrationStore)
}

TimeRegistration.defaultProps = {}