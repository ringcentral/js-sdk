function encodeURIComponentWithUndefined(value) {
    return typeof value === 'undefined' ? '' : encodeURIComponent(value);
}

/**
 * Convert an object to URL query parameters string.
 * @param {object} obj - The object to convert.
 * @returns {string} - The URL query parameters string.
 */
export function objectToUrlParams(obj) {
    return Object.keys(obj)
        .map((key) => {
            if (Array.isArray(obj[key])) {
                return obj[key]
                    .map((value) => encodeURIComponent(key) + '=' + encodeURIComponentWithUndefined(value))
                    .join('&');
            }
            return encodeURIComponent(key) + '=' + encodeURIComponentWithUndefined(obj[key]);
        })
        .join('&');
}
