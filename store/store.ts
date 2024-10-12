
import { configureStore , combineReducers } from '@reduxjs/toolkit'
import { adaptationSearchReducer, searchReducer, userReducer } from './slice'
import { postsReducer } from './slice'
import { eventSearchReducer } from './slice';

import { eventReducer } from './slice';
import { forumPostReducer } from './slice';

const rootReducer = combineReducers({
    search: searchReducer,
    posts: postsReducer,
    eventSearch: eventSearchReducer,
    eventID: eventReducer,
    forumURL: forumPostReducer,
    user: userReducer,
    adaptationSearch: adaptationSearchReducer,
});

export const store = () => {
    return configureStore({
        reducer: rootReducer,
    });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']