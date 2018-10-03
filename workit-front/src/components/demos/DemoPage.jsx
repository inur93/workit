import React, {Component} from 'react';
import {observer} from "mobx-react";
import Editable from "./cms/Editable";
import {decorate, observable} from "mobx";
import {Grid, Button} from '@material-ui/core';

class DemoPage extends Component {

    items = [
        {
            value: "test 1"
        },
        {
            value: "test 2"
        }
    ];

    itemMap = {
        row1col1: {
            value: "row 1 col 1"
        }, row1col2: {
            value: "row 1 col 2"
        }, row2col1: {
            value: "row 2 col 1"
        }, row2col2: {
            value: "row 2 col 2"
        },
    };

    richText = {

    }

    editMode = true;

    constructor(props) {
        super(props);
        let row = 0;
        for (let i = 0; i < 50; i++) {
            if (i % 6 === 0) row++;
            this.itemMap[`row${row}col${i % 6}`] = {
                value: `row ${row} col ${i % 6}`
            };
        }
    }

    getColumns = (row, num) => {
        let cols = [];
        for (let i = 0; i < num; i++) {
            const item = this.itemMap[`row${row}col${i % 6}`];
            cols.push(<Grid key={item.value} item xs={12 / num}>
                <Editable editable={this.editMode} item={item} field="value">
                    <p>{item.value}</p>
                </Editable>
            </Grid>)
        }
        return cols;
    };

    getRichTextColumns = (row, num) => {
        let cols = [];
        for (let i = 0; i < num; i++) {
            const item = this.itemMap[`row${row}col${i % 6}`];
            cols.push(<Grid key={"rte-" + item.value} item xs={12 / num}>
                <Editable type='rte' editable={this.editMode} item={item} field="value">
                    <div dangerouslySetInnerHTML={{__html: item.value}} />
                </Editable>
            </Grid>)
        }
        return cols;
    };

    render() {
        const {items, itemMap, editMode} = this;
        return (
            <div>
                <h1>Demo page</h1>
                <Grid container>
                    <Grid item xs={12}>
                        <Button onClick={() => this.editMode = !this.editMode}>{editMode ? "preview mode" : "edit mode"}</Button>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <p>test simple paragraph with single column</p>
                    </Grid>
                    {this.getColumns(1, 1)}
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <p>test simple paragraph with multiple columns</p>
                    </Grid>
                    {this.getColumns(2, 2)}
                    {this.getColumns(3, 6)}
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <p>test with button</p>
                    </Grid>
                    <Grid item xs={12}>
                        <Editable editable={editMode} item={itemMap.row1col1} field={"value"}>
                            <Button onClick={() => alert("you should not click - just edit")}>{itemMap.row1col1.value}</Button>
                        </Editable>
                    </Grid>
                    <Grid item xs={12}>
                        <Editable editable={editMode} item={itemMap.row1col1} field={"value"}>
                            <Button onClick={() => alert("you should not click - just edit")}>{itemMap.row1col1.value}</Button>
                        </Editable>
                        <Editable editable={editMode} item={itemMap.row1col2} field={"value"}>
                            <Button onClick={() => alert("you should not click - just edit")}>{itemMap.row1col2.value}</Button>
                        </Editable>
                    </Grid>
                </Grid>
                <Grid container>
                   <Grid item xs={12}>
                        <p>test rich text</p>
                    </Grid>
                    {this.getRichTextColumns(1, 3)}
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <p>test links</p>
                    </Grid>
                    <Grid item xs={12}>
                        <Editable editable={editMode} item={itemMap.row1col1} field={"value"}>
                            <a href={"https://www.facebook.com"}>{itemMap.row1col1.value}</a>
                        </Editable>

                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default observer(DemoPage)
DemoPage.propTypes = {};

DemoPage.defaultProps = {};

decorate(DemoPage, {
    items: observable,
    itemMap: observable,
    editMode: observable
})