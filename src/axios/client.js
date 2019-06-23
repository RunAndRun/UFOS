import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://api.mdmlmw.com', // 接口服务地址
  // baseURL: 'http://192.168.0.105:8888', // dev
  timeout: 5000,
  withCredentials: true // 允许跨域发送cookie
})

export default instance
