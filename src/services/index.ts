import axios from "axios";

export const http = axios.create({
    baseURL: 'https://dummyjson.com',
    headers: {
        Accept: 'application/json',
        Content: 'application/json'
    }
})

