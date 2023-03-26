// 先把所有的工具函数导出的模块在这里导入，整合在一起再统一导出
import http from './http.jsx'
import{ setToken,getToken,removeToken} from './token.jsx'

export {
  http,
  setToken,
  getToken,
  removeToken
}