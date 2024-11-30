import axios from 'axios'

export const BASE_DOMAIN = (() => {
       return 'http://135.181.22.115:2323/api/'
})()
export const BASE_URL = BASE_DOMAIN
export const API = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    httpAgent: true,
})