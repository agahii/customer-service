import axios from 'axios'

export const BASE_DOMAIN = (() => {
       return 'https://slcloudapi.cloudstronic.com/api/'
})()
export const BASE_URL = BASE_DOMAIN
export const API = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    httpAgent: true,
})