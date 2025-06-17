import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
// const userStore = useUserStore()
// const { userInfo } = storeToRefs(userStore)
import axios from 'axios'
// 创建axios实例
const httpInstance = axios.create({
    baseURL: '/api',
    // timeout: 5000
})

// axios请求拦截器，发请求之前做什么
httpInstance.interceptors.request.use(config => {
    // if (userInfo.token) {
    //     config.headers.Authorization = userInfo.token;  
    // }
    return config
}, e => Promise.reject(e))

// axios响应式拦截器，拿到数据做什么
httpInstance.interceptors.response.use(response => {
    //成功
    return response.data
}, err => {
    //失败
    return Promise.reject(err)
})

export default httpInstance