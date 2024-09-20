import {EventEmitter} from 'events';
import Cache from './core/Cache';
import Externals, {ExternalsOptions} from './core/Externals';
import * as Constants from './core/Constants';
import Client, {ApiError, CreateRequestOptions} from './http/Client';
import Platform, {
    CreateUrlOptions,
    LoginOptions,
    LoginUrlOptions,
    LoginWindowOptions,
    PlatformOptions,
    SendOptions,
} from './platform/Platform';
import {AuthData} from './platform/Auth';

export {
    Cache,
    Externals,
    LoginOptions,
    LoginUrlOptions,
    LoginWindowOptions,
    CreateUrlOptions,
    SendOptions,
    AuthData,
    ExternalsOptions,
    CreateRequestOptions,
    ApiError,
};

let defaultExternals: ExternalsOptions = {};

export const setDefaultExternals = (externals: ExternalsOptions) => (defaultExternals = externals);

export class SDK {
    private _externals: Externals;

    private _cache: Cache;

    private _client: Client;

    private _platform: Platform;

    public static version = Constants.version;

    public static EventEmitter = EventEmitter;

    /**
     * Sandbox Server https://platform.devtest.ringcentral.com
     * Production Server https://platform.ringcentral.com
     */
    public static server = {
        sandbox: 'https://platform.devtest.ringcentral.com',
        production: 'https://platform.ringcentral.com',
    };

    /**
     * Handles login redirect by sending authentication response to the opener window.
     * @param origin The origin to post the message to.
     * @param win The window object. If not provided, defaults to the global window object.
     */
    public static handleLoginRedirect(origin, win) {
        // Use the provided window object or default to the global window object.
        win = win || window;

        // Get the authentication response from the location search or hash.
        const response = win.location.search ? win.location.search : win.location.hash;

        // Create a message object containing the authentication response.
        const msg = {};
        msg[Constants.authResponseProperty] = response;

        // Post the message to the opener window with the specified origin.
        win.opener.postMessage(msg, origin || win.location.origin);
    }

    /**
     * Constructs a new SDK instance with the provided options.
     * @param options The SDK options.
     */
    public constructor(options: SDKOptions = {}) {
        // Destructure options or use default values.
        const {cachePrefix, defaultRequestInit, handleRateLimit} = options;

        // Warn if using sandbox server (deprecated).
        if (options?.server === SDK.server.sandbox) {
            // eslint-disable-next-line no-console
            console.warn('Sandbox support is deprecated. Please migrate your application to Production Server.');
        }

        // Initialize external dependencies.
        this._externals = new Externals({
            ...defaultExternals,
            ...options,
        });

        // Initialize cache.
        this._cache = new Cache({
            externals: this._externals,
            prefix: cachePrefix,
        });

        // Initialize client.
        this._client = new Client({
            externals: this._externals,
            defaultRequestInit,
        });

        // Initialize platform.
        this._platform = new Platform({
            ...options,
            externals: this._externals,
            client: this._client,
            cache: this._cache,
            handleRateLimit,
        });
    }

    public platform() {
        return this._platform;
    }

    public client() {
        return this._client;
    }

    public cache() {
        return this._cache;
    }

    public externals() {
        return this._externals;
    }

    /* istanbul ignore next */
    public send = async (options: SendOptions): Promise<Response> => this.platform().send(options);

    /* istanbul ignore next */
    public get = async (url, query?, options?: SendOptions): Promise<Response> =>
        this.platform().send({method: 'GET', url, query, ...options});

    /* istanbul ignore next */
    public post = async (url, body?, query?, options?: SendOptions): Promise<Response> =>
        this.platform().send({method: 'POST', url, query, body, ...options});

    /* istanbul ignore next */
    public put = async (url, body?, query?, options?: SendOptions): Promise<Response> =>
        this.platform().send({method: 'PUT', url, query, body, ...options});

    /* istanbul ignore next */
    public patch = async (url, body?, query?, options?: SendOptions): Promise<Response> =>
        this.platform().send({method: 'PATCH', url, query, body, ...options});

    /* istanbul ignore next */
    public delete = async (url, query?, options?: SendOptions): Promise<Response> =>
        this.platform().send({method: 'DELETE', url, query, ...options});

    /* istanbul ignore next */
    public login = async (options: LoginOptions): Promise<Response> => this.platform().login(options);

    /* istanbul ignore next */
    public ensureLoggedIn = async (): Promise<Response> => this.platform().ensureLoggedIn();

    /* istanbul ignore next */
    public loginUrl = (options: LoginUrlOptions): string => this.platform().loginUrl(options);

    /* istanbul ignore next */
    public createUrl = (path, options: CreateUrlOptions): string => this.platform().createUrl(path, options);

    /* istanbul ignore next */
    public signUrl = async (path): Promise<string> => this.platform().signUrl(path);

    /* istanbul ignore next */
    public parseLoginRedirect = (url): any => this.platform().parseLoginRedirect(url);

    /* istanbul ignore next */
    public logout = async (): Promise<Response> => this.platform().logout();

    /* istanbul ignore next */
    public loginWindow = async (options: LoginWindowOptions): Promise<LoginOptions> =>
        this.platform().loginWindow(options);

    /* istanbul ignore next */
    public refresh = async (): Promise<Response> => this.platform().refresh();

    /* istanbul ignore next */
    public multipart = async (response: Response): Promise<Response[]> => this.client().multipart(response);

    /* istanbul ignore next */
    public getContentType = (response: Response): string => this.client().getContentType(response);

    /* istanbul ignore next */
    public isMultipart = (response: Response) => this.client().isMultipart(response);

    /* istanbul ignore next */
    public isJson = (response: Response) => this.client().isJson(response);

    /* istanbul ignore next */
    public error = (response: Response): Promise<string> => this.client().error(response);
}
export interface SDKOptions extends PlatformOptions, ExternalsOptions {
    cachePrefix?: string;
    defaultRequestInit?: CreateRequestOptions;
    handleRateLimit?: boolean | number;
}

export default SDK;
