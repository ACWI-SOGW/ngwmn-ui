// http://www.html5rocks.com/en/tutorials/es6/promises/

/**
 * Executes an HTTP GET request.
 * @param  {String} url         URL to request
 * @param  {String} resolveWith XMLHttpRequest attribute to resolve promise
 *                              with. e.g., "response" or "responseXML"
 * @return {Promise}
 */
export function get(url, resolveWith='response') {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function () {
            // This is called even on 404 etc
            // so check the status
            if (req.status == 200) {
                // Resolve the promise with the response text
                resolve(req[resolveWith]);
            } else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                if (window.ga) {
                    window.ga('send', 'event', 'serviceFailure', req.status, url);
                }
                reject(Error(`Failed with status ${req.status}: ${req.statusText}`));
            }
        };

        // Handle network errors
        req.onerror = function () {
            reject(Error('Network Error'));
        };

        // Make the request
        req.send();
    });
}

/**
 * Executes an HTTP GET request.
 * @param  {String} url         URL to request
 * @param  {String} resolveWith XMLHttpRequest attribute to resolve promise
 *                              with. e.g., "response" or "responseXML"
 * @return {Promise}
 */
export function post(url, sampleData, resolveWith='response') {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.open('POST', url);

        req.onload = function () {
            // This is called even on 404 etc
            // so check the status
            if (req.status == 200) {
                // Resolve the promise with the response text
                resolve(req[resolveWith]);
            } else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                if (window.ga) {
                    window.ga('send', 'event', 'serviceFailure', req.status, url);
                }
                reject(Error(`Failed with status ${req.status}: ${req.statusText}`));
            }
        };

        // Handle network errors
        req.onerror = function () {
            reject(Error('Network Error'));
        };

        // Make the request
        req.send(sampleData);
    });
}
