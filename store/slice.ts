
import { createSlice , PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "./store";


type PostType = {
    id: string;
    name: string;
    title: string;
    description: string;
    profilePic: string;
    postImage: string;
    likes: number;
    shares: number;
    options: Array<any>;
    comments: number;
    questionImageURL: string;
    createdAt: string;
    anonymity: boolean;
    ansNumbers: number;
    uid:string;
    // Add any other fields as necessary
  };

type UserData={
    following: Array<string>;
    followers: Array<string>;
    name: string;
    email: string;
};

export enum UserType {
    Guest = "guest",
    Student = "student",
    Organization = "organization",
}

interface User {
    uid?: string;
    email?: string | null;
    name?: string | null;
    photoURL?: string | null;
    followers?: Array<string>;
    userType: UserType;
}

interface PostState {
    posts : PostType[];
    categoryQ: string;
    categoryE: string;
    change: boolean;
    userCache: Record<string, UserData>; // UserData represents the structure of user data related to posts
}

const initialState: PostState = {
    posts: [],
    categoryQ: "all",
    categoryE: "all",
    change: true,
    userCache: {},
}

export const initialUserState: User = {
    uid: undefined,
    email: undefined,
    name: undefined,
    photoURL: undefined,
    followers: [],
    userType: UserType.Guest,
};

//for storing cache using Redux

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state , action: PayloadAction<PostType[]>) => {
            state.posts = action.payload;
            console.log(state.posts);
        },
        updateUserCache: (state, action: PayloadAction<{ uid: string; userData: UserData }>) => {
            state.userCache[action.payload.uid] = action.payload.userData;
        },
        addPosts: (state , action: PayloadAction<PostType[]>) => {
            state.posts = [...state.posts, ...action.payload];
        },
        setCategoryE: (state, action: PayloadAction<string>)=>{
            state.categoryE = action.payload;
        }, 
        setCategoryQ: (state, action: PayloadAction<string>)=>{
            state.categoryQ = action.payload;
        },
        setChange: (state, action)=>{
            state.change = !state.change;
        }
    }
});


//for algolia search through navbar component

export const searchSlice = createSlice({
    name: "search",
    initialState: {
        searchText: "",
        searchTriggered: false,
    },
    reducers: {
        setSearchText: (state, action) => {
        state.searchText = action.payload;
        },
        triggerSearch: (state) => {
            state.searchTriggered = !state.searchTriggered;
        }
    },
    });
    

//for algolia search but for events

export const eventSearchSlice = createSlice({
    name: "eventSearch",
    initialState: {
        searchText: "",
        searchTriggered: false,
    },
    reducers: {
        setSearchText: (state, action) => {
        state.searchText = action.payload;
        },
        triggerSearch: (state) => {
            state.searchTriggered = !state.searchTriggered;
        }
    },
    });

//for algolia search on adaptation list.

export const adaptationSearchSlice = createSlice({
    name: "adaptationSearch",
    initialState: {
        searchText: "",
        searchTriggered: false,
    },
    reducers: {
        setAdaptationSearchText: (state, action) => {
        state.searchText = action.payload;
        },
        triggerAdaptationSearch: (state) => {
            state.searchTriggered = !state.searchTriggered;
        }
    },
    });


//for storing event_id for additional event information page
export const eventSlice = createSlice({
    name: "event",
    initialState: {
        event_id: null,
    },
    reducers: {
        setEventId: (state, action) => {
        state.event_id = action.payload;
        }
    },
});

//for forum posts
export const forumPostSlice = createSlice({
    name: "forumPost",
    initialState: {
        currentForum: null,
    },
    reducers: {
        setForumURL: (state, action) => {
        state.currentForum = action.payload;
        }
    },
});

//user Type
export const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            // Update the state with the provided user data
            const { uid, name, photoURL, userType, email, followers } = action.payload;
            state.uid = uid;
            state.email = email;
            state.name = name;
            state.photoURL = photoURL;
            state.followers = followers;
            state.userType = userType; // Update userType based on the payload

            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        resetUser: (state) => {
            // Reset to guest user type and clear other data
            state.uid = undefined;
            state.name = undefined;
            state.email = undefined;
            state.photoURL = undefined;
            state.followers = [];
            state.userType = UserType.Guest;

            localStorage.removeItem('user');
        },
        loadUserFromLocalStorage: (state) => {
            const user = localStorage.getItem('user');
            if (user) {
                const parsedUser = JSON.parse(user);
                state.uid = parsedUser.uid;
                state.name = parsedUser.name;
                state.email = parsedUser.email;
                state.photoURL = parsedUser.photoURL;
                state.followers = parsedUser.followers;
                state.userType = parsedUser.userType;
            }
            return state; // Return the default state if no user data is found
        },
    },
});




//algolia search
export const { setSearchText , triggerSearch } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;


export const {setAdaptationSearchText, triggerAdaptationSearch} = adaptationSearchSlice.actions;
export const adaptationSearchReducer = adaptationSearchSlice.reducer;

//caching
export const {setPosts , addPosts, setCategoryE, setChange, setCategoryQ, updateUserCache} = postsSlice.actions;
export const categoryE = (state: RootState) => state.posts.categoryE;
export const categoryQ = (state: RootState) => state.posts.categoryQ;
export const userCache = (state: RootState) => state.posts.userCache;
export const forumPostURL = (state: RootState) => state.forumURL.currentForum;
export const change = (state: RootState) =>state.posts.change;
export const postsReducer = postsSlice.reducer;
export const selectPosts = (state: RootState) => state.posts.posts;

//algoia search for events
export const { setSearchText: setEventSearchText , triggerSearch: triggerEventSearch } = eventSearchSlice.actions;
export const eventSearchReducer = eventSearchSlice.reducer;

// for event additional information
export const { setEventId } = eventSlice.actions;
export const eventReducer = eventSlice.reducer;
export const forumPostReducer = forumPostSlice.reducer;

export const {setForumURL} = forumPostSlice.actions;

//for keeping track opf logged in user
export const { setUser, resetUser, loadUserFromLocalStorage } = userSlice.actions;
export const userReducer = userSlice.reducer;
export const selectUserType = (state: RootState) => state.user.userType;
export const selectUser = (state: RootState) => state.user;