import axios from 'axios';

const baseUrl = 'http://localhost:8000';

export const getPeoples=async()=>{
    return await axios.get(baseUrl+'/get/peoples').then(data=>{
        return data.data
    })
}

export const addPeople=async(data)=>{
    return await axios.post(baseUrl+"/add/people",data)
}

export const getDegreeOfSeperation=async(data)=>{
    return await axios.post(baseUrl+'/get/relation',data);
}