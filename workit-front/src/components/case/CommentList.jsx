import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import Divider from "@material-ui/core/Divider/Divider";
import Typography from "@material-ui/core/Typography/Typography";

const styles = theme => ({}
);

class CommentList extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <Grid container direction={"column"}>
                {this.props.comments.map(c => <Comment key={c.created} text={c.text} author={c.author} created={c.created} />)}
            </Grid>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(CommentList));

const Comment = ({text, author, created}) =>
    <Grid container direction={"column"}>
        <Grid item>
            <Typography variant={"body2"}>
            {author && author.name}
            </Typography>
        </Grid>
        <Grid item>
            <Typography gutterBottom >
            {new Date(created).toLocaleString('da-dk', {year: 'numeric', month: 'long', day: "2-digit", hour: "2-digit", minute: "2-digit"})}
            </Typography>
        </Grid>
        <Grid item >
            <Typography variant={"body2"} gutterBottom>
            {text}
            </Typography>
        </Grid>
        <Divider />
    </Grid>
decorate(CommentList, {});

CommentList.propTypes = {
    comments: PropTypes.array
};

CommentList.defaultProps = {};