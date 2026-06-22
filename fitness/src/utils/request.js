import axios from 'axios';
const request = axios.create({
    baseURL: 'http://localhost:8080',  // 后端地址
    timeout: 10000,                     // 超时时间
    headers: {
        'Content-Type': 'application/json'
    }
});
request.interceptors.response.use(
    response => {
        // 直接返回 data，不用每次都写 response.data
        return response.data;
    },
    error => {
        console.error('请求错误：', error);
        return Promise.reject(error);
    }
);

export default request;