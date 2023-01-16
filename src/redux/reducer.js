import { createSlice } from "@reduxjs/toolkit";
export const peopleSlice = createSlice({
    name:'people',
    initialState:{
        value: []
    },
    reducers:{
        getPeople:(state,action)=>{
            // var value =  getPeoples().then(data=>{
            //     console.log(data);
            //     return data
            // })
            // console.log(value);
            // state.value =  value.then(data=>{
            //     return data
            // })
            state.value=action.payload
        },
    },
})
export const {getPeople} = peopleSlice.actions

export default peopleSlice.reducer