import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, reaction, observable, computed} from 'mobx';
import {withStyles} from '@material-ui/core/styles';
import {FormControl, TextField,
Button, Select} from '@material-ui/core';
import CmsStore from "../stores/CmsStore";
import Editable from "./cms/Editable";
import FieldsTable from "./cms/FieldsTable";

const styles = theme => ({}
);

class ManageFields extends Component {

    newLanguage = "";
    selectedLanguage = "";

    constructor(props) {
        super(props);
        this.selectedLanguage = props.store.currentLanguage || "";
    }

    componentWillMount(){
        this.props.store.fetchAllFields();
    }

    handleLanguageSelection = (evt) => {
        this.selectedLanguage = evt.target.value;
    };

    addLanguage = () => {
        this.props.store.createLanguage(this.newLanguage)
            .then(res => {
                this.newLanguage = "";
            })
    };

    get currentFields (){
        const entries = this.props.store.fields.entries();
        let entry;
        const map = {};
        const list = [];
        while(!(entry = entries.next()).done){
            map[entry.value[0]] = entry.value[1];
            let keys = entry.value[0].split('#');

            debugger;
           /* let key = entry.value[0];
            if(key.startsWith(this.selectedLanguage)){
                list.push(entry.value[0] + ":" + entry.value[1]);
            }*/
        }
        return list;
    }

    render() {
        const {classes} = this.props;
        const {languages} = this.props.store;
        const {newLanguage, selectedLanguage, currentFields} = this;
        return (
            <div>
                <h1><Editable field="manage-fields"/></h1>
                <FormControl margin="normal">
                    <TextField
                        label={"Language"}
                        value={newLanguage}
                        onChange={(evt) => this.newLanguage = evt.target.value}
                    />
                    <Button color="primary" variant="raised" onClick={this.addLanguage}>
                        <Editable field="add-language"/>
                    </Button>
                </FormControl>
                <FormControl>
                    <Select
                        native
                        value={selectedLanguage}
                        inputProps={{id: "select-language"}}
                        onChange={this.handleLanguageSelection}
                        className={classes.selectEmpty}>
                        {languages.map(lang => <option value={lang} key={lang}><Editable lock field={lang}/></option>)}
                    </Select>
                </FormControl>
                {/*<div>
                    {currentFields.map(field => <p key={field}>{field}</p>)}
                </div>*/}
                <FieldsTable data={[{
                    id: 1,
                    name: "test"
                }]}/>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(observer(ManageFields));

decorate(ManageFields, {
    newLanguage: observable,
    selectedLanguage: observable,
    currentFields: computed
});

ManageFields.propTypes = {
    store: PropTypes.instanceOf(CmsStore)
};

ManageFields.defaultProps = {};