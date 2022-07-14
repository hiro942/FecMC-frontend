import axios, { AxiosRequestConfig } from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import { timeFormatter } from '@/utils/formatters'
import useUserStore from '@/store/modules/user'
import { ServiceCode } from '@/constants/api'

// 生产服务器地址 -> http://10.99.12.103:88/api
// 局域网测试地址 -> http://10.128.252.195:88/api
// Apifox -> http://127.0.0.1:4523/m1/1118652-0-default
// baseURL: import.meta.env.DEV ? 'http://127.0.0.1:4523/m1/1118652-0-default' : 'http://10.99.12.103:88/api'

// 创建axios服务实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  baseURL: import.meta.env.DEV
    ? 'http://127.0.0.1:4523/m1/1118652-0-default'
    : 'http://10.99.12.103:88/api', // url = base url + request url
  timeout: 10 * 1000, // request timeout 10s
  withCredentials: true, // 跨域请求携带cookie等凭证信息
})

// 响应异常拦截处理
const errorHandler = (error: any) => {
  console.error('[error handler]', error)
  if (error.response) {
    const { status } = error.response
    if (status === 401) {
      ElNotification.error('UnAuthorized')
    }
    if (status === 403) {
      ElNotification.error('Forbidden')
    }
  }
  return Promise.reject(error)
}

// 全局请求拦截器
service.interceptors.request.use(
  (config) => config,
  (error) => {
    console.log('[interceptors.request]: request error', error) // for debug
    return Promise.reject(error)
  }
)

// 全局响应拦截器
service.interceptors.response.use(
  // 处理响应，交出实际数据
  (response) => {
    console.log('[interceptor.response]: baseUrl', response.config.baseURL)

    const { code, data, msg, description } = response.data

    // 如果是获取任务列表的接口，把数据里面的time统一格式化之后再返回
    const requestUrl = response.config.url // 请求url
    if (requestUrl === '/task/mytask' || requestUrl === '/task/allTask') {
      const tasks = data as FLearningAPI.TaskInfo[] // 得到返回的tasks
      for (let i = 0; i < tasks.length; i += 1) {
        tasks[i].assignDateTime = timeFormatter(tasks[i].assignDateTime)
      }
      response.data.data = tasks
      console.log('[interceptor.response]:', response.data)
    }

    // [未登录]: 退出登录
    if (code === ServiceCode.NoLoginError) {
      console.error('[interceptor.response]: 40100', response.data)
      useUserStore().doLogout()
    }

    // 其他业务错误
    if (code !== ServiceCode.Success) {
      console.error('[interceptor.response]: non-zero code', response.data)
      ElMessage.error(description || '请求出错')
      return Promise.reject(new Error(description || '请求出错'))
    }

    return response.data
  },
  errorHandler
)

// 封装通用axios请求函数
async function request<T>(config: AxiosRequestConfig) {
  return service.request<T>(config).then((responseData) => responseData.data)
}

export default request
