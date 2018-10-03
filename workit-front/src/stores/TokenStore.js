import {decorate, observable, action, reaction, computed} from 'mobx';
import {warning} from "../components/shared/Toast";

class TokenStore {
    _token = null;

    constructor(){
        this._token = window.localStorage.getItem('jwt');
       reaction(
            ()=>this._token,
            token => {
            if (token){
                window.localStorage.setItem('jwt', token);
            } else {
                window.localStorage.removeItem('jwt');
            }
        })
        this.startAutoCheck();
    }

    set token(token){
        this._token = token || null;
        this.startAutoCheck();
    }

    get token (){
        return this._token;
    }

    get user(){
        if (!this.token) return null;
        return this.decodeClaims(this.token).user;
    }

    getClaims = ()=>{
        return this.decodeClaims(this.token);
    };

    decodeClaims = (token) => {
        if (!token) return null;
        const claims = token.split(".")[1];
        //const decodedClams = decodeURIComponent(encodeURI(window.atob(claims)));
        const decodedClams = decodeURIComponent(escape(window.atob(claims))); //FIXME temp fix with encoding issue
        return JSON.parse(decodedClams);
    };

    logout(exp) {
        this.token = null;
        clearTimeout(this.timer);
        if (exp) {
            warning("Dit login er udløbet. Log venligst ind igen")
        }
    }

    startAutoCheck() {
        if (!this.token) return;
        const exp = new Date(this.getClaims().exp * 1000);
        const now = new Date();
        const timeOut = (exp - now) - 10000;
        this.timer = setTimeout(()=>
            this.logout(true)
        , timeOut);
    }
}
decorate(TokenStore, {
    _token: observable,
    user: computed,
    logout: action

});

export default new TokenStore();
