import axios from "axios";

export const http = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
       Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tZSI6IlBEVlVTUiIsImVtYWlsIjoicGR2dXNyQGdtYWlsLmNvbSIsImlhdCI6MTcwMDc4NDQxNywiZXhwIjoxNzAwNzg3NDE3fQ.OucZ3uW33hlLS-rViB5id80p-3C5nR2XsK-bC4NGbF4',
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
