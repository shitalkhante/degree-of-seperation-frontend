import {configureStore} from "@reduxjs/toolkit";
import peopleReducer from './reducer';
export default configureStore({
    reducer:{
        people : peopleReducer,
    }
})