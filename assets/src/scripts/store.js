import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { default as thunk } from 'redux-thunk';

import graphReducers from './components/graph/state';
import wellLogReducers from './components/well-log/state';
import serviceReducers from './services/state';


const MIDDLEWARES = [thunk];

const REDUCERS = {
    ...graphReducers,
    ...wellLogReducers,
    ...serviceReducers
};

const configureStore = function (initialState = null) {
    // Create an initial state with all the reducer mount points initialized
    // with an empty object.
    initialState = initialState || Object.keys(REDUCERS).reduce((state, key) => {
        state[key] = {};
        return state;
    }, {});

    let enhancers;
    if (window.__REDUX_DEVTOOLS_EXTENSION__) {
        enhancers = compose(
            applyMiddleware(...MIDDLEWARES),
            window.__REDUX_DEVTOOLS_EXTENSION__({serialize: true})
        );
    } else {
        enhancers = applyMiddleware(...MIDDLEWARES);
    }

    return createStore(
        combineReducers(REDUCERS),
        initialState,
        enhancers
    );
};

export default configureStore;
