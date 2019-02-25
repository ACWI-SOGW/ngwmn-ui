// http://www.html5rocks.com/en/tutorials/es6/promises/

/**
 * Executes an XMLHttpRequest.
 * @param  {String} url         URL to request
 * @param  {String} data        POST data
 * @param  {String} resolveWith XMLHttpRequest attribute to resolve promise
 *                              with. e.g., "response" or "responseXML"
 * @param  {String} contentType request Content-Type
 * @return {Promise}
 */
export function request(url, {method='GET', resolveWith='response', contentType='', data=''}) {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
        try {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open(method, url);
            if (contentType != '') {
                req.setRequestHeader('Content-Type', contentType);
            }

            req.onload = function () {
                // This is called even on 404 etc so check the status
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

            // Make the
            if (method === 'POST' || data !== '') {
                req.send(data);
            } else {
                req.send();
            }
        } catch (e) {
            //console.log(e);
        }
    });
}

/**
 * Executes an HTTP GET request.
 * @param  {String} url         URL to request
 * @param  {String} resolveWith XMLHttpRequest attribute to resolve promise
 *                              with. e.g., "response" or "responseXML"
 * @param  {String} contentType request Content-Type
 * @return {Promise}
 */
export function get(url, {resolveWith='response', contentType=''}) {
    return request(url, {
        method:'GET',
        resolveWith:resolveWith,
        contentType:contentType
    });
}

/**
 * Executes an HTTP POST request.
 * @param  {String} url         URL to request
 * @param  {String} data        POST data
 * @param  {String} resolveWith XMLHttpRequest attribute to resolve promise
 *                              with. e.g., "response" or "responseXML"
 * @param  {String} contentType request Content-Type
 * @return {Promise}
 */
export function post(url, {data, resolveWith='response', contentType = ''}) {
    return request(url, {
        method:'POST',
        resolveWith:resolveWith,
        contentType:contentType,
        data:data
    });
}
