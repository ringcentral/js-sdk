import {SDK} from '@ringcentral/sdk';
import {combineReducers, Store} from 'redux';

import Actions, {ActionsOptions} from './actions';
import {status, error, loading} from './reducer';

export interface StoreConnectorOptions extends ActionsOptions {
    root?: string;
}

/**
 * Class responsible for connecting authentication actions with Redux store
 */
export default class StoreConnector {
    private sdk: SDK; // SDK instance for authentication

    private store: Store; // Redux store to connect with

    public root: string; // Root key in the Redux store for authentication state

    public actions: Actions; // Instance of Actions class for dispatching authentication actions

    /**
     * Constructor to initialize StoreConnector with SDK instance and options
     */
    public constructor({sdk, root = 'rcAuth'}: StoreConnectorOptions) {
        this.sdk = sdk;
        this.root = root;
        this.actions = new Actions({sdk});
    }

    /**
     * Method to connect StoreConnector with a Redux store
     * Attaches event listeners to SDK platform events for handling authentication
     * Dispatches actions based on authentication events
     */
    public connectToStore = async (store: Store) => {
        this.store = store;
        const {dispatch} = store;
        const platform = this.sdk.platform();

        // Event listeners for handling authentication events
        platform.on(platform.events.loginError, (e) => dispatch(this.actions.authError(e)));
        platform.on(platform.events.refreshError, (e) => dispatch(this.actions.authError(e)));
        platform.on(platform.events.logoutError, (e) => dispatch(this.actions.authError(e)));

        platform.on(platform.events.loginSuccess, () => dispatch(this.actions.loginSuccess()));
        platform.on(platform.events.logoutSuccess, () => dispatch(this.actions.logoutSuccess()));

        try {
            // Checking if access token is valid or refreshing token
            if (await platform.auth().accessTokenValid()) {
                dispatch(this.actions.loginSuccess()); // manual dispatch
            } else {
                await platform.refresh();
            }
        } catch (e) {
            //eslint-disable-line
            // can be empty because error is caught by event listener
        }
    };

    /**
     *  Reducer function for combining authentication reducers
     */
    public reducer = combineReducers({
        status,
        error,
        loading,
    });

    // Selector function to get authentication state from Redux store
    public getAuth = (state) => state[this.root];

    // Selector function to get authentication status from Redux store
    public getAuthStatus = (state) => this.getAuth(state).status;

    // Selector function to get authentication error from Redux store
    public getAuthError = (state) => this.getAuth(state).error;

    // Selector function to get authentication loading state from Redux store
    public getAuthLoading = (state) => this.getAuth(state).loading;
}
