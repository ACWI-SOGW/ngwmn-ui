/**
 * Returns a function that will be a no-op if a condition is false.
 * Use to insert conditionals into declarative-style D3-chained method calls.
 * @param  {Boolean} condition If true, will run `func`
 * @param  {Function} func
 */
export const callIf = function (condition, func) {
    return function (...args) {
        if (condition) {
            func(...args);
        }
    };
};
