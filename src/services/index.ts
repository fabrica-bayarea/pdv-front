import axios from "axios";

export const http = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
       Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tZSI6IlBEVlVTUiIsImVtYWlsIjoicGR2dXNyQGdtYWlsLmNvbSIsImlhdCI6MTcwMDgzMDMzMSwiZXhwIjoxNzAwODMzMzMxfQ.x7dFspEjVj52s_mmnn76Lp5wqOqDbBDqNQYTfSMS8JE',
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
