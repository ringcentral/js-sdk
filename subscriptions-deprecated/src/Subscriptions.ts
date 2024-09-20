import PubNubDefault from 'pubnub';
import {SDK} from '@ringcentral/sdk';
import Subscription, {SubscriptionOptions} from './subscription/Subscription';
import CachedSubscription, {CachedSubscriptionOptions} from './subscription/CachedSubscription';

export {SubscriptionOptions, CachedSubscriptionOptions};

/**
 * Represents a set of subscription management functionalities.
 */
export class Subscriptions {
    private _sdk: SDK; // The SDK instance used for subscription management.

    private _PubNub: any; // The PubNub instance used for subscription communication.

    /**
     * Constructor for Subscriptions class.
     * @param sdk The SDK instance.
     * @param PubNub The PubNub instance (deprecated, use WebSockets instead).
     */
    public constructor({sdk, PubNub = PubNubDefault}: SubscriptionsOptions) {
        this._sdk = sdk;
        this._PubNub = PubNub;
        // Warn about deprecated usage of PubNub.
        // eslint-disable-next-line no-console
        console.warn('PubNub support is deprecated. Please migrate your application to WebSockets.');
    }

    /**
     * Creates a new subscription.
     * @param pollInterval Polling interval for subscription.
     * @param renewHandicapMs Renewal handicap for subscription.
     * @returns A new Subscription instance.
     */
    public createSubscription({pollInterval, renewHandicapMs}: SubscriptionOptions = {}) {
        return new Subscription({
            pollInterval,
            renewHandicapMs,
            sdk: this._sdk,
            PubNub: this._PubNub,
        });
    }

    /**
     * Creates a new cached subscription.
     * @param cacheKey Cache key for subscription.
     * @param pollInterval Polling interval for subscription.
     * @param renewHandicapMs Renewal handicap for subscription.
     * @returns A new CachedSubscription instance.
     */
    public createCachedSubscription({cacheKey, pollInterval, renewHandicapMs}: CachedSubscriptionOptions) {
        return new CachedSubscription({
            cacheKey,
            pollInterval,
            renewHandicapMs,
            sdk: this._sdk,
            PubNub: this._PubNub,
        });
    }

    /**
     * Gets the PubNub instance.
     * @returns The PubNub instance.
     */
    public getPubNub() {
        return this._PubNub;
    }
}

export interface SubscriptionsOptions {
    sdk: SDK;
    PubNub?: typeof PubNubDefault;
}

export default Subscriptions;
