import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { default as thunk } from 'redux-thunk';

import graphReducers from './components/graph/state';
import serviceReducers from './services/state';


const MIDDLEWARES = [thunk];

const REDUCERS = {
    ...graphReducers,
    ...serviceReducers
};

const configureStore = function () {
    // Create an initial state with all the reducer mount points initialized
    // with an empty object.
    const initialState = Object.keys(REDUCERS).reduce((state, key) => {
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
