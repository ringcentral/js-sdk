import {SDK} from '@ringcentral/sdk';
import EventEmitter from 'events';
import RingCentral from '@rc-ex/core';
import RcSdkExtension from '@rc-ex/rcsdk';
import WebSocketExtension from '@rc-ex/ws';
import waitFor from 'wait-for-async';

/**
 * Class for handling subscriptions.
 * Extends EventEmitter for event handling.
 */
export class Subscription extends EventEmitter {
    private subscriptions: Subscriptions; // Private member variable for Subscriptions instance
    public events = {
        notification: 'notification', // Define event name for notifications
    };
    public eventFilters!: string[]; // Define property for event filters

    /**
     * Constructor to initialize the Subscription instance.
     * @param options  Options object containing subscriptions.
     */
    public constructor(options: {subscriptions: Subscriptions}) {
        super(); // Call EventEmitter constructor
        this.subscriptions = options.subscriptions; // Assign Subscriptions instance from options
    }

    /**
     *  Method to set event filters.
     * @param eventFilters - Array of event filters.
     * @returns
     */
    public setEventFilters(eventFilters: string[]) {
        this.eventFilters = eventFilters;
        return this;
    }

    /**
     * Method to register for subscriptions.
     * Subscribes to events with specified event filters and emits notifications.
     * @returns
     */
    public async register() {
        await this.subscriptions.init();
        const wsExtension = await this.subscriptions.newWsExtension();
        return await wsExtension.subscribe(this.eventFilters, (event) => {
            this.emit(this.events.notification, event);
        });
    }
}

/**
 * Class for managing subscriptions.
 */
export class Subscriptions {
    private status = 'new'; // Status of subscriptions: new, in-progress, ready
    public rc: RingCentral; // RingCentral instance
    public rcSdkExtension: RcSdkExtension; // RcSdkExtension instance

    /**
     * Constructor to initialize Subscriptions instance with SDK.
     * @param options - Options object containing SDK.
     */
    public constructor(options: {sdk: SDK}) {
        this.rc = new RingCentral(); // Initialize RingCentral instance
        this.rcSdkExtension = new RcSdkExtension({rcSdk: options.sdk}); // Initialize RcSdkExtension instance with SDK
    }

    /**
     * Method to initialize subscriptions.
     * Installs RcSdkExtension and sets status to 'ready' when subscriptions are ready.
     * If subscriptions are already ready or in-progress, does nothing.
     * If subscriptions are in-progress, waits until they are ready.
     */
    public async init() {
        if (this.status === 'ready') {
            // If subscriptions are already ready, return
            return;
        }
        if (this.status === 'in-progress') {
            // If subscriptions are in progress, wait for them to be ready
            await waitFor({
                condition: () => this.status === 'ready',
            });
            return;
        }
        this.status = 'in-progress';
        await this.rc.installExtension(this.rcSdkExtension);
        this.status = 'ready'; // Set status to ready when subscriptions are ready
    }

    /**
     * Method to create a new WebSocket extension.
     * @returns Promise that resolves with the created WebSocket extension.
     */
    public async newWsExtension() {
        const wsExtension = new WebSocketExtension();
        await this.rc.installExtension(wsExtension);
        return wsExtension;
    }

    /**
     * Method to create a new Subscription instance.
     * @returns New Subscription instance.
     */
    public createSubscription(): Subscription {
        return new Subscription({subscriptions: this});
    }
}

export default Subscriptions;
