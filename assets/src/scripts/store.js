import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { default as thunk } from 'redux-thunk';

import services from './services/duck';


const MIDDLEWARES = [thunk];

const rootReducer = combineReducers({
    services
});

const configureStore = function (initialState = {}) {
    initialState = {
        ...initialState
    };

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
        rootReducer,
        initialState,
        enhancers
    );
};

export default configureStore;
