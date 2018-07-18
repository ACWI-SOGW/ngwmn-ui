import { applyMiddleware, createStore, compose } from 'redux';
import { default as thunk } from 'redux-thunk';


const MIDDLEWARES = [thunk];

export default function (initialState = {}) {
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
        state => state,
        initialState,
        enhancers
    );
}
