import "babel-regenerator-runtime";
import * as Utils from "./core/Utils";
import Cache from "./core/Cache";
import * as Externals from "./core/Externals";
import EventEmitter from "events";
import Client from "./http/Client";
import ApiResponse from "./http/ApiResponse";
import {default as ClientMock} from "./mocks/ClientMock";
import Mock from "./mocks/Mock";
import Registry from "./mocks/Registry";
import Platform from "./platform/Platform";
import Auth from "./platform/Auth";
import PubnubMockFactory from "./pubnub/PubnubFactory";
import Subscription from "./subscription/Subscription";
import CachedSubscription from "./subscription/CachedSubscription";
import constants from "./core/Constants";

class SDK {

    static version = constants.version;

    static server = {
        sandbox: 'https://platform.devtest.ringcentral.com',
        production: 'https://platform.ringcentral.com'
    };

    /**
     * @namespace RingCentral
     * @constructor
     * @param {object} [options]
     * @param {string} [options.server]
     * @param {string} [options.cachePrefix]
     * @param {string} [options.appSecret]
     * @param {string} [options.appKey]
     * @param {string} [options.appName]
     * @param {string} [options.appVersion]
     * @param {string} [options.pubnubFactory]
     * @param {string} [options.client]
     * @param {string} [options.redirectUri]
     */
    constructor({server, cachePrefix, appSecret, appKey, appName, appVersion, pubnubFactory, client, redirectUri}) {

        if (!Externals.fetch) {
            throw new Error('Native Fetch is missing, set RingCentral.SDK.core.Externals.fetch to your favorite alternative');
        }

        if (!Externals.Promise) {
            throw new Error('Native Promise is missing, set RingCentral.SDK.core.Externals.Promise to your favorite alternative');
        }

        this._cache = new Cache(Externals.localStorage, cachePrefix);

        this._client = client || new Client();

        this._platform = new Platform({
            client: this._client,
            cache: this._cache,
            version: SDK.version,
            server,
            appKey,
            appSecret,
            appName,
            appVersion,
            redirectUri
        });

        this._pubnubFactory = pubnubFactory || Externals.PUBNUB;

    }

    /**
     * @return {Platform}
     */
    platform() {
        return this._platform;
    }

    /**
     * @return {Subscription}
     */
    createSubscription() {
        return new Subscription(this._pubnubFactory, this._platform);
    }

    /**
     * @return {CachedSubscription}
     */
    createCachedSubscription(cacheKey) {
        return new CachedSubscription(this._pubnubFactory, this._platform, this._cache, cacheKey);
    }

    /**
     * @return {Cache}
     */
    cache() {
        return this._cache;
    }

    static core = {
        Cache: Cache,
        EventEmitter: EventEmitter,
        Utils: Utils,
        Externals: Externals
    };

    static http = {
        Client: Client,
        ApiResponse: ApiResponse
    };

    static platform = {
        Auth: Auth,
        Platform: Platform
    };

    static subscription = {
        Subscription: Subscription
    };

    static mocks = {
        Client: ClientMock,
        Registry: Registry,
        Mock: Mock
    };

    static pubnub = {
        PubnubMockFactory: PubnubMockFactory
    };

    static handleLoginRedirect(origin) {
        var response = window.location.hash ? window.location.hash : window.location.search;
        window.opener.postMessage({[constants.authResponseProperty]: response}, origin || window.location.origin);
    }

}

module.exports = SDK;