// 用户登陆注册接口
import httpInstance from '@/utlis/http'

export const userRegisterAPI = ({ username, password, rePassword }) =>
  httpInstance.post('/register', { username, password, rePassword })

export const userLoginAPI = ({ username, password }) =>
  httpInstance.post('/login', { username, password })

export const personListAPI = (id) =>
  httpInstance.delete('/api/delete', {
    params: { id }
  })
