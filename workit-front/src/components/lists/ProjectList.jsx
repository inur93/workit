import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import CustomTableCell from "../shared/CustomTableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "@material-ui/core/TableCell/TableCell";
import {Link} from "react-router-dom";
import {Links} from "../../config/Links";
import Table from "@material-ui/core/Table/Table";

const styles = theme => ({}
);

class ProjectList extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        const {projects} = this.props;
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <CustomTableCell>ID</CustomTableCell>
                        <CustomTableCell>Project</CustomTableCell>
                        <CustomTableCell>Client</CustomTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects.map(project =>
                        <TableRow key={project.id}>
                            <TableCell>
                                <Link to={Links.project(project.id)}>{project.id}</Link>
                            </TableCell>
                            <TableCell>
                                <Link to={Links.project(project.id)}>{project.name}</Link>
                            </TableCell>
                            <TableCell>
                                <Link to={Links.client(project.clientId)}>{project.clientId}</Link>
                            </TableCell>
                        </TableRow>)}
                </TableBody>
            </Table>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(ProjectList));

decorate(ProjectList, {});

ProjectList.propTypes = {
    projects: PropTypes.oneOfType([PropTypes.object, PropTypes.array])//mobx array is an object
};

ProjectList.defaultProps = {
    projects: []
};