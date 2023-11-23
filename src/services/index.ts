import axios from "axios";

export const http = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
       Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tZSI6IlBEVlVTUiIsImVtYWlsIjoicGR2dXNyQGdtYWlsLmNvbSIsImlhdCI6MTcwMDU3Njg0MSwiZXhwIjoxNzAwNTc5ODQxfQ.C6wK-1p4awAaCl-5UMQv2gPg-YN2TsV4oHUsGvRi-7U',
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
