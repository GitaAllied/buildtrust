import { legacy_createStore as createStore, combineReducers } from 'redux';
import sidebar_reducer, { signout_reducer } from './reducer';

// We use combineReducers so you can add more reducers (like Auth, Products, etc.) later
const rootReducer = combineReducers({
    sidebar: sidebar_reducer,
    signout: signout_reducer
});

const store = createStore(rootReducer);

export default store;
