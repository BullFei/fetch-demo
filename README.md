## 前言

> 前端现在使用三大框架来开发时，如果要发生网络请求(ajax)使用以前的JQuery来操作时，非常不明智。有杀鸡用牛刀的感觉。
>
> 这时就涌现了很多的网络请求工具，体积小，专注于发送网络请求就很方便。

1. angular.js 使用内置的http模块
2. vuejs 使用vue-resource、fetch、axios
3. react 使用fetch、axios

## vue-resource

> vue1.x的时候，发送网络请求的一个插件。vue2.x的时候，尤大大推荐我们使用axios，vue-resource不再维护（不想重复去造轮子）

### 安装vue-resource

```bash
$ npm install vue-resource
```

### 使用

```
//main.js
//引入vue
//引入vue-resource
//使用Vue.use 调用vue-resource
import VueResource from 'vue-resource'
Vue.use(VueResource)
//使用Vue.http 或者 this.$http调用
this.$http.get(url, [options]).then().catch()
this.$http.post(url, [body], [options]).then().catch()
this.$http(options).then().catch()
```

[更多语法查看](https://www.runoob.com/vue2/vuejs-ajax.html)



## fetch

> ES6提供的一个底层的请求API，用来替代XMLHttpRequest这个API的

### 安装

> 不需要额外安装，因为fetch是底层API
>
> 但是fetch它有兼容性问题，如果要处理兼容性问题，就可以去安装一个Polyfill

[fetchAPI](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)       [Polyfill文档API](https://github.com/github/fetch)

### 语法

```javascript
fetch(url).then(response => response.json()).then().catch()
```

## axios

> 一款基于XMLHttpRequest 对象封装的网络请求工具，同时支持浏览器端和Node端，集成了Promise

[参考文档](http://www.axios-js.com/)

### 特点

- 从浏览器中创建XMLHttpRequests
- 从node.js创建http请求
- 支持Promise API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换JSON数据
- 客户端支持防御XSRF

### 安装

```bash
$ npm install axios
```

### 语法

```javascript
axios.get(url, [options]).then().catch()
axios.post(url, [body], [options]).then().catch()
...
axios(options).then().catch()
axios.get(
  'http://localhost:3000/hello',
  {
    params: {
      name: '张三',
      age: 18
    }
  },
  (res) => {
    console.log(res.data)
  }
)
axios({
  url: 'http://localhost:3000/hello',
  method: 'POST',
  params: {
    name: '张三',
    age: 18
  },
  data: {
    password: '123456'
  }
}).then(res => {
  console.log(res.data)
})

axios
 .post('http://localhost:3000/world', {
   name: '张三'
 })
 .then((res) => {
   console.log(res.data)
 })
```

> 请求完成以后返回的信息，是axios包装的一个对象，对象结构如下

```javascript
{
  //这个属性，是接口返回的数据
  data: {},
  //响应http状态码
  status: 200,
  //响应状态信息
  statusText: "OK",
  //响应的头信息
  headers:{},
  //请求的时候的一些配置信息
  config: {},
  //XMLHttpRequest 对象的一些信息
  request: {}
}
```

### 问题

> #### post请求的时候，后台告诉我们参数接受不到？
>
> 1. 先确保我们前端参数传递正确了（看语法有没有写错）
> 2. 循环后台是否支持json格式的数据（axios，默认都是一个json格式的数据传输）
>
> 1. 1. 方案一：让后台支持一下json格式
>    2. 方案二：前端自己对参数做转化，转换成key1=value&key2=value2这种格式效果。



> #### 后台的一些接口中，需要前端在请求头中传递token，如何优雅的去做呢？
>
> 1. 普通方案，在请求时配置headers这个配置项
> 2. 优雅方案，对axios做一些默认配置

```javascript
axios.defaults.headers = {token:'123456'}  //不要这么写，覆盖了默认的headers
axios.defaults.headers['token'] = '123456' //这样写才对
```

> #### 上述的token是写死的，正常token应该是灵活设置
>
> 我们可以在请求拦截中处理token

```javascript
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
```

> #### 思考：每次我们接受数据都是通过res.data获取，如何能通过res获取数据呢？

```javascript
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
```

> #### 每个文件都需要单独引入一下axios好麻烦，能不能像vue-resource一样，类似通过this.$http去使用呢？
>
> 直接将axios挂载在Vue的原型上即可

```javascript
//main.js
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios
```

## 后台跨域解决：

```javascript
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Headers": "content-type,token",
```