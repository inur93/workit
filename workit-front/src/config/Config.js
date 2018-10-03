export default class Config{

    //Use local development server when running in development mode!
    static API_BASE = ("development" === process.env.NODE_ENV) ? "http://localhost:8080" : "";
    static API_PATH = Config.API_BASE + "/rest/v1";
    static TOKEN_NAME ="jwt";

}

