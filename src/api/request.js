// 对axios进行二次封装
import axios from 'axios'
// 引入进度条
// import nprogress from 'nprogress'
// 引入进度条样式
// import "nprogress/nprogress.css"
const requests = axios.create({
  baseURL: '/api',
  timeout: 5000
})
requests.interceptors.request.use((config) => {
  // if(store.state.user.token){
  // config.headers.token = store.state.user.token
  // }
  // if(localStorage.getItem('token')){
  // config.headers.token = localStorage.getItem('TOKEN')

  // 赶进度，先固定，后面改
  config.headers.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc4OTU3Mjg5fQ.pVOMBPTYD4_6JH4MhVaT6MoExJ054mxhaTSOtiQTPcU'
  // console.log('localStorage.getItem token',localStorage.getItem('TOKEN'));
  // }
  // console.log(' config.headers.token', config.headers.token);
  // 进度条开始动
  // nprogress.start()
  return config
})

requests.interceptors.response.use((res) => {
  // 进度条结束
  // nprogress.done()
  return res.data
}, (err) => {
  return Promise.reject(err)
})
export default requests
