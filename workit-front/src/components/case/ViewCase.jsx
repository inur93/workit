import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {decorate, observable} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import CaseStore from "../../stores/CaseStore";
import Typography from "@material-ui/core/Typography/Typography";
import CustomButton from "../shared/CustomButton";
import {Link, withRouter} from "react-router-dom";
import {Links} from "../../config/Links";
import CommentList from "./CommentList";
import RegisterTime from "../modals/RegisterTime";
import {FieldRow, FieldRowUser, Title} from "../shared/SimpleComponents";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import Perm from "../management/Perm";
import {Policies} from "../../config/Policies";
import {success, error} from "../shared/Toast";
import {D} from "../cms/Editable";
import Error from "../shared/Error";

const styles = theme => ({
        row: {
            marginTop: 5,
            marginBottom: 5
        },
        rowHeader: {
            fontSize: '1em'
        },
        rowContent: {
            fontSize: '1em'
        }
    }
);

class ViewCase extends Component {

    showTimeRegistration = false;

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.reloadCase();
    }

    reloadCase = () => {
        const {match, caseStore} = this.props;
        const {caseId, projectId} = match.params;
        caseStore.getCase(projectId, caseId);
    }

    registerTime = (registration) => {
        const {projectId, caseId} = this.props.match.params;
        this.props.caseStore.registerTime(projectId, caseId, registration)
            .then((created) => {
                this.showTimeRegistration = false;
                success(`${created.hours} ${D("hours registered")}`);
                this.reloadCase();
            })
            .catch(err => {
                error(err.message);
            })
    };

    handleShowTimeRegistration = () => {
        this.showTimeRegistration = true;
    };

    render() {

        const {hasError, error, isLoading, currentCase} = this.props.caseStore;
        if (isLoading) return <LinearProgress color="secondary"/>;
        if (hasError) return <Error>{error}</Error>;
        const {title, id, description, priority, status, estimate, timeSpent, comments, responsible} = currentCase;
        const {classes, match} = this.props;
        const {projectId, caseId} = match.params;

        return (
            <Grid container direction={"column"}>
                <RegisterTime open={this.showTimeRegistration} handleClose={() => this.showTimeRegistration = false}
                              register={this.registerTime}/>
                <Grid item>
                    <Title>View case</Title>
                </Grid>
                <Grid item>
                    <Grid container spacing={8}>
                        <Perm permissions={Policies.projectsIdCasesIdUpdate(projectId, caseId)}>
                            <Grid item>
                                <CustomButton variant="raised" color="primary"
                                              component={Link}
                                              to={Links.editCase(projectId, caseId)}>Edit</CustomButton>
                            </Grid>
                        </Perm>
                        <Perm permissions={Policies.projectsIdCasesIdTimeReg(projectId, caseId)}>
                            <Grid item>
                                <CustomButton variant="raised" color="primary"
                                              onClick={this.handleShowTimeRegistration}>Register time</CustomButton>
                            </Grid>
                        </Perm>
                    </Grid>
                </Grid>
                <FieldRow title={"ID"} content={id}/>
                <FieldRow title={"Title"} content={title}/>
                <FieldRow title={"Description"} content={description}/>
                <FieldRow title={"Priority"} content={priority}/>
                <FieldRow title={"Status"} content={status}/>
                <FieldRowUser title={"Responsible"} user={responsible} emptyText={"no responsible"}/>
                <FieldRow title={"Estimate"} content={estimate}/>
                <FieldRow title={"Time spent"} content={timeSpent}/>
                <Grid item>
                    <Grid container>
                        <Grid item xs={3} md={2}>
                            <Typography className={classes.rowHeader} variant={"body2"}>
                                {D("Comments")}
                            </Typography>
                        </Grid>
                        <Grid item xs={9} md={10}>
                            <CommentList comments={comments || []}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(inject("caseStore")(observer(ViewCase))));

decorate(ViewCase, {
    showTimeRegistration: observable
});

ViewCase.propTypes = {
    match: PropTypes.object.isRequired,
    caseStore: PropTypes.instanceOf(CaseStore)
};

ViewCase.defaultProps = {};