import axios from "axios";

export const http = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
       Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tZSI6IlBEVlVTUiIsImVtYWlsIjoicGR2dXNyQGdtYWlsLmNvbSIsImlhdCI6MTcwMDg4NDczNSwiZXhwIjoxNzAwODg3NzM1fQ.QRrd2cDd3n7uFMe7xxSHYeyPZb3aGWRc_r2rUHXXTOQ',
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
