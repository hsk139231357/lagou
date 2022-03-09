/**
 * 基于 axios 封装的请求模块
 */

import axios from 'axios'

export const request = axios.create({
	baseURL: 'http://realworld.api.fed.lagounews.com'
	// 备选： https://conduit.productionready.io || http://realworld.api.fed.lagounews.com
})

// 通过插件机制获取到上下文对象（query/params/req/res/app/store）
// 插件导出函数必须作为 default 成员
export default ({ store }) => {
	// 请求拦截器
	// Add a request interceptor
	// 任何请求都要经过请求拦截器
	// 我们可以在请求拦截器中做一些公共的业务处理，例如统一设置 token
	request.interceptors.request.use(function (config) {
		// Do something before request is sent
		const { user } = store.state;
		if(user && user.token) {
			config.headers.Authorization = `Token ${user.token}`
		}

		return config;
	}, function (error) {
		// Do something with request error
		return Promise.reject(error);
	});
	// 相应拦截器
}