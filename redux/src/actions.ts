import {SDK} from '@ringcentral/sdk';
import {AUTH_ERROR, LOGIN, LOGIN_SUCCESS, LOGOUT, LOGOUT_SUCCESS} from './constants';

export interface ActionsOptions {
    sdk: SDK;
}
/**
 * Actions class responsible for handling authentication actions
 */
export default class Actions {
    public sdk: SDK;

    // Constructor to initialize the Actions class with an SDK instance
    public constructor({sdk}: ActionsOptions) {
        this.sdk = sdk;
    }

    /**
     * Method to handle login action
     * It initiates the login process using the SDK
     * If an error description is provided, it dispatches an authentication error
     * Returns an action of type LOGIN
     * @param query
     * @returns
     */
    public login = (query) => {
        if (query.error_description) {
            return this.authError(new Error(query.error_description));
        }
        this.sdk.login(query); // we ignore promise result because we listen to all events already
        return {type: LOGIN};
    };

    /**
     * Method to handle logout action
     * It initiates the logout process using the SDK
     * @returns Returns an action of type LOGOUT
     */
    public logout = () => {
        this.sdk.logout(); // we ignore promise result because we listen to all events already
        return {type: LOGOUT};
    };

    /**
     * Method to dispatch login success action
     * @returns Returns an action of type LOGIN_SUCCESS
     */
    public loginSuccess = () => ({
        type: LOGIN_SUCCESS,
    });

    /**
     * Method to dispatch authentication error action
     * @param error Takes an error object as input and dispatches an action of type AUTH_ERROR
     * @returns Returns the dispatched action
     */
    public authError = (error) => ({
        type: AUTH_ERROR,
        payload: error,
        error: true,
    });

    /**
     * Method to dispatch logout success action
     * @returns Returns an action of type LOGOUT_SUCCESS
     */
    public logoutSuccess = () => ({
        type: LOGOUT_SUCCESS,
    });
}
