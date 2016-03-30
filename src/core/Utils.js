import {Promise} from "./Externals.js";

/**
 * TODO Replace with something better
 * @see https://github.com/joyent/node/blob/master/lib/querystring.js
 * @param {object} parameters
 * @returns {string}
 */
export function queryStringify(parameters) {

    var array = [];

    parameters = parameters || {};

    Object.keys(parameters).forEach((k) => {

        var v = parameters[k];

        if (isArray(v)) {
            v.forEach((vv) => {
                array.push(encodeURIComponent(k) + '=' + encodeURIComponent(vv));
            });
        } else {
            array.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }

    });

    return array.join('&');

}

/**
 * TODO Replace with something better
 * @see https://github.com/joyent/node/blob/master/lib/querystring.js
 * @param {string} queryString
 * @returns {object}
 */
export function parseQueryString(queryString) {

    var argsParsed = {};

    queryString.split('&').forEach((arg) => {

        arg = decodeURIComponent(arg);

        if (arg.indexOf('=') == -1) {

            argsParsed[arg.trim()] = true;

        } else {

            var pair = arg.split('='),
                key = pair[0].trim(),
                value = pair[1].trim();

            if (key in argsParsed) {
                if (key in argsParsed && !isArray(argsParsed[key])) argsParsed[key] = [argsParsed[key]];
                argsParsed[key].push(value);
            } else {
                argsParsed[key] = value;
            }

        }

    });

    return argsParsed;

}

/**
 * @param obj
 * @return {boolean}
 */
export function isFunction(obj) {
    return typeof obj === "function";
}

/**
 * @param obj
 * @return {boolean}
 */
export function isArray(obj) {
    return Array.isArray ? Array.isArray(obj) : typeof obj === "array";
}

export function isObject(o) {
    return o != null && typeof o === 'object' && !isArray(o);
}

export function isObjectObject(o) {
    return isObject(o) === true && Object.prototype.toString.call(o) === '[object Object]';
}

export function isPlainObject(o) {
    var ctor, prot;

    if (isObjectObject(o) === false) return false;

    // If has modified constructor
    ctor = o.constructor;
    if (typeof ctor !== 'function') return false;

    // If has modified prototype
    prot = ctor.prototype;
    if (isObjectObject(prot) === false) return false;

    // If constructor does not have an Object-specific method
    if (prot.hasOwnProperty('isPrototypeOf') === false) {
        return false;
    }

    // Most likely a plain Object
    return true;
}

/**
 * @param fn
 * @param interval
 * @param timeout
 */
export function poll(fn, interval, timeout) { //NodeJS.Timer|number

    module.exports.stopPolling(timeout);

    interval = interval || 1000;

    var next = (delay) => {

        delay = delay || interval;

        interval = delay;

        return setTimeout(() => {

            fn(next, delay);

        }, delay);

    };

    return next();

}

export function stopPolling(timeout) {
    if (timeout) clearTimeout(timeout);
}

export function isNodeJS() {
    return (typeof process !== 'undefined');
}

export function isBrowser() {
    return (typeof window !== 'undefined');
}

export function delay(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(null);
        }, timeout);
    });
}

/**
 * TODO Replace with something better
 * @see http://stackoverflow.com/users/109538/broofa
 * @returns {string}
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}