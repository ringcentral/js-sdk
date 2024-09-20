import Externals from './Externals';

export interface CacheOptions {
    prefix?: string;
    externals: Externals;
}

export default class Cache {
    public static defaultPrefix = 'rc-';

    private readonly _prefix = null;

    private _externals = null;

    public constructor({prefix = Cache.defaultPrefix, externals}: CacheOptions) {
        this._prefix = prefix;
        this._externals = externals;
    }

    /**
     * Synchronously sets an item in the local storage.
     * @param {string} key - The key under which to store the data.
     * @param {any} data - The data to store.
     * @returns {Object} - Returns the current instance for chaining.
     */
    public setItemSync(key, data) {
        this._externals.localStorage.setItem(this._prefixKey(key), JSON.stringify(data));
        return this;
    }

    public async setItem(key, data) {
        await this._externals.localStorage.setItem(this._prefixKey(key), JSON.stringify(data));
        //this.setItemSync(key, data);
    }

    /**
     * Synchronously removes an item from the local storage.
     * @param {string} key - The key of the item to remove.
     * @returns {Object} - Returns the current instance for chaining.
     */
    public removeItemSync(key) {
        this._externals.localStorage.removeItem(this._prefixKey(key));
        return this;
    }

    public async removeItem(key) {
        await this._externals.localStorage.removeItem(this._prefixKey(key));
        //await this.removeItemSync(key);
    }

    /**
     * Synchronously retrieves an item from the local storage.
     * @param {string} key - The key of the item to retrieve.
     * @returns {any} - The retrieved item, or null if the item does not exist.
     */
    public getItemSync(key) {
        const item = this._externals.localStorage.getItem(this._prefixKey(key));
        if (!item) {
            return null;
        }
        return JSON.parse(item);
    }

    public async getItem(key) {
        const item = await this._externals.localStorage.getItem(this._prefixKey(key));
        if (!item) {return null;}
        return JSON.parse(item);
       // return this.getItemSync(key);
    }

    private async _keys(): Promise<string[]> {
        return 'keys' in this._externals.localStorage
            ? this._externals.localStorage.keys() // could be async
            : Object.keys(this._externals.localStorage);
    }

    /**
     * Asynchronously cleans up the local storage by removing all items with keys prefixed by the specified prefix.
     * @returns {Object} - Returns the current instance for chaining.
     */
    public async clean() {
        await Promise.all(
            (
                await this._keys()
            ).map(async (key) => {
                if (key.startsWith(this._prefix)) {
                    await this._externals.localStorage.removeItem(key);
                }
            })
        );

        return this;
    }

    private _prefixKey(key: string) {
        return this._prefix + key;
    }
}
