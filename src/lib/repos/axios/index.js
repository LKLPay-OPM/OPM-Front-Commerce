import axios from 'axios'

class AppEndpoint {
  client = axios.create()

  constructor(contentType = 'application/json', baseUrl= 'http://192.168.100.31:3001/api') {
    // this.client.defaults.baseURL = 'http://localhost:3000/api'
    this.client.defaults.baseURL = baseUrl
    this.client.defaults.headers.common['Content-Type'] = contentType
  }
}

export const axiosClient = new AppEndpoint().client
export const axiosFormDataClient = new AppEndpoint('multipart/form-data').client
export const profilesFormDataClient = new AppEndpoint('multipart/form-data', 'http://18.234.171.110:3000/api').client
export const axiosTransactionsClient = new AppEndpoint('application/json', 'http://192.168.100.31:3002/api').client