import React, {Component} from 'react';

import {SDK} from '@ringcentral/sdk';

// Utility function to get display name
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// Utility function for delaying execution
const delay = () => new Promise(res => setTimeout(res, 0));

// Interface for the state of AuthGate component
export interface AuthGateState {
    isAuthorized: boolean;
    authorizing: boolean;
    authError: null | Error;
}

// Interface for the render props provided by AuthGate
export interface AuthGateRenderProps extends AuthGateState {
    loginUrl: (options: any) => string;
    parseRedirect: (search: string) => Promise<any>;
    logout: () => Promise<any>;
}

// Interface for the props of AuthGate component
export interface AuthGateProps {
    sdk: SDK;
    ensure?: boolean;
    children: (props: AuthGateRenderProps) => any;
}

// AuthGate component definition
export class AuthGate extends Component<AuthGateProps, AuthGateState> {

    // Initial state
    public state = {
        isAuthorized: false,
        authorizing: true,
        authError: null,
    };

    // default props
    public static defaultProps = {
        ensure: false,
    };

    /**
     * purposely going through antipattern because we can't cancel promises for now
     * we still cancel subscriptions etc., but we can't guarantee when storage promises will resolve
     * @type {boolean}
     */
    public mounted = false;

    public async componentDidMount() {
        this.mounted = true;
        try {
            const {sdk, ensure} = this.props;
            const platform = sdk.platform();

            // Event listeners for various platform events
            platform.on(platform.events.beforeRefresh, this.before);
            platform.on(platform.events.beforeLogin, this.before);
            platform.on(platform.events.refreshError, this.error);
            platform.on(platform.events.loginError, this.error);
            platform.on(platform.events.logoutSuccess, this.success);
            platform.on(platform.events.loginSuccess, this.success);
            platform.on(platform.events.refreshSuccess, this.success);

            if (ensure) {
                await platform.ensureLoggedIn();
            }

            await this.updateState();
        } catch (e) {
            await this.updateState(e);
        }
    }

    public componentWillUnmount() {
        this.mounted = false;
        const {sdk} = this.props;
        const platform = sdk.platform();
        // Removing event listeners
        platform.removeListener(platform.events.beforeRefresh, this.before);
        platform.removeListener(platform.events.beforeLogin, this.before);
        platform.removeListener(platform.events.refreshError, this.error);
        platform.removeListener(platform.events.loginError, this.error);
        platform.removeListener(platform.events.logoutSuccess, this.success);
        platform.removeListener(platform.events.loginSuccess, this.success);
        platform.removeListener(platform.events.refreshSuccess, this.success);
    }

    // Handler for before event
    public before = () => this.mounted && this.setState({authorizing: true});

    // Handler for error event
    public error = async e => this.updateState(e);

    // Handler for success event
    public success = async () => this.updateState(null);

    // Method to get login URL
    public loginUrl = options => this.props.sdk.platform().loginUrl(options);

    // Method to logout
    public logout = async () => {
        const platform = this.props.sdk.platform();
        return platform.logout();
    };

    // Method to parse redirect
    public parseRedirect = async search => {
        try {
            const platform = this.props.sdk.platform();
            const loginOptions = platform.parseLoginRedirect(search);
            if (!loginOptions.code && !loginOptions.access_token) {throw new Error('No authorization information');}
            return platform.login(loginOptions);
        } catch (e) {
            await this.error(e);
            throw e;
        }
    };

    // Method to update state
    public updateState = async (authError = null) => {
        await delay();
        this.mounted &&
            this.setState({
                isAuthorized: await this.props.sdk
                    .platform()
                    .auth()
                    .accessTokenValid(),
                authorizing: false,
                authError,
            });
    };

    // Render method
    public render() {
        const {sdk, ensure, children, ...props} = this.props;
        return children({
            ...this.state,
            ...props,
            loginUrl: this.loginUrl,
            parseRedirect: this.parseRedirect,
            logout: this.logout,
        });
    }
}

//TODO Definition
export const withAuthGate = ({sdk, ensure = false}: {sdk: SDK; ensure?: boolean}) => Cmp => {
    const WrappedCmp = props => (
        <AuthGate sdk={sdk} ensure={ensure}>
            {renderProps => <Cmp {...props} {...renderProps} />}
        </AuthGate>
    );
    WrappedCmp.displayName = `withAuthGate(${getDisplayName(Cmp)})`;
    return WrappedCmp;
};
