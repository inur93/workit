import {decorate, observable, computed, action, reaction} from 'mobx';
import agent from '../agent';
/*
created: 04-07-2018
created by: Runi
*/

export default class CmsStore {

    fields = observable.map({});
    currentLanguage = localStorage.getItem("currentLanguage");

    _languages = [];

    hasError = false;
    error = "";

    constructor() {
        agent.Cms.getAllFields(this.currentLanguage)
            .then(this.handleLoadedFields)
            .catch(this.handleError);
        agent.Cms.getLanguages()
            .then(this.handleLoadedLanguages)
            .catch(this.handleError);
        reaction(() => this.currentLanguage, language => {
            localStorage.setItem("currentLanguage", language);
            agent.Cms.getAllFields(language)
                .then(this.handleLoadedFields)
                .catch(this.handleError);
        })
    }

    getField = (name) => {
        return this.fields.get(`${this.currentLanguage}#${name}`) || name;
    };

    saveField = (field) => {
        field.language = this.currentLanguage;
        return agent.Cms.updateSimpleField(field)
            .then(saved => {
                this.fields.set(saved.id, saved.value); //when language is introduced properly - value should the saved object - and the Editable component should handle the languages.
                return saved;
            });
    };

    handleLoadedFields = (json) => {
        json.forEach(field => {
            this.fields.set(field.id, field.value);
        });
    };

    handleLoadedLanguages = (json) => {
        this._languages = json || [];
    };

    createLanguage = (lang) => {
        return agent.Cms.updateSimpleField({
            name: lang,
            language: lang,
            value: lang
        })
            .then(field => {
                this._languages.push(lang);
                return lang;
            });
    };

    get languages(){
        return this._languages;
    }

    fetchAllFields = () => {
        agent.Cms.getAllFields().then(this.handleLoadedFields);
    }

    handleError = err => {
        this.error = err.message;
        this.hasError = true;
    }
}

decorate(CmsStore, {
    handleLoadedFields: action,
    currentLanguage: observable,
    languages: computed,
    _languages: observable,

    hasError: observable,
    error: observable
});
