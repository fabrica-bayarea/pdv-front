import axios from "axios";

export const http = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        Accept: 'application/json',
        Content: 'application/json'
    }
})

export const httpTeste = axios.create({
    baseURL: 'http://localhost:3004',
    headers: {
        Accept: 'application/json',
        Content: 'application/json'
    }
})
