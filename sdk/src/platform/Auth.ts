import Cache from '../core/Cache';

const DEFAULT_RENEW_HANDICAP_MS = 60 * 1000; // 1 minute

export interface AuthOptions {
    refreshHandicapMs?: number;
}

export interface AuthOptionsConstructor extends AuthOptions {
    cache: Cache;
    cacheId: string;
}

/**
 * Represents an authentication handler class
 */
export default class Auth {
    private _cache: Cache;

    private readonly _cacheId: string;

    private readonly _refreshHandicapMs: number;

    public constructor({cache, cacheId, refreshHandicapMs = DEFAULT_RENEW_HANDICAP_MS}: AuthOptionsConstructor) {
        this._cache = cache;
        this._cacheId = cacheId;
        this._refreshHandicapMs = refreshHandicapMs;
    }

    // Fetches authentication data from the cache
    public async data(): Promise<AuthData> {
        return (
            (await this._cache.getItem(this._cacheId)) || {
                token_type: '',
                access_token: '',
                expire_time: 0,
                expires_in: '',
                refresh_token: '',
                refresh_token_expires_in: '',
                refresh_token_expire_time: 0,
                scope: '',
            }
        );
    }

    // Sets authentication data in the cache
    public async setData(newData: AuthData = {}) {
        const data = await this.data();
        const savedData: AuthData = {
            ...data,
            ...newData,
        };
        if (typeof newData.expires_in !== 'undefined' && !newData.expire_time) {
            savedData.expire_time = Date.now() + parseInt(newData.expires_in, 10) * 1000;
        }
        if (typeof newData.refresh_token_expires_in !== 'undefined' && !newData.refresh_token_expire_time) {
            savedData.refresh_token_expire_time = Date.now() + parseInt(newData.refresh_token_expires_in, 10) * 1000;
        }
        await this._cache.setItem(this._cacheId, savedData);
    }

    /**
     * Check if there is a valid (not expired) access token
     */
    public async accessTokenValid() {
        const authData = await this.data();
        return authData.expire_time - this._refreshHandicapMs > Date.now();
    }

    /**
     * Check if there is a valid (not expired) access token
     */
    public async refreshTokenValid() {
        return (await this.data()).refresh_token_expire_time > Date.now();
    }

    public async cancelAccessToken() {
        return this.setData({
            access_token: '',
            expires_in: '-1',
        });
    }
}

export interface AuthData {
    token_type?: string;
    access_token?: string;
    expires_in?: string;
    expire_time?: number;
    refresh_token?: string;
    refresh_token_expires_in?: string;
    refresh_token_expire_time?: number;
    scope?: string;
    code_verifier?: string;
    owner_id?: string;
    endpoint_id?: string;
}
