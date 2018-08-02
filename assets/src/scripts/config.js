/**
 * Export runtime configuration settings stored in the global CONFIG variable.
 */
const config = window.CONFIG || {};
export default {
    ...config
};
