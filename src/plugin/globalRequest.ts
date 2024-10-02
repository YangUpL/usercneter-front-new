import { extend } from 'umi-request';

/**
* 配置request请求时的默认参数
*/
const request = extend({
    credentials: 'include', // 默认请求是否带上cookie
    prefix: process.env.NODE_ENV === 'production' ? 'http://8.130.183.113:8080' : "http://localhost:8080",
    // requestType: 'json',
});

export default request;