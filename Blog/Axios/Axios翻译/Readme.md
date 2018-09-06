# Axios

### 基于Promise且用于Node.js和浏览器的HTTP客户端

> 目前手上的项目，对Ajax请求/响应之后的各种异常状态的响应，需要仔细了解Axios这个Ajax HTTP请求工具的使用方法，在了解的过程中顺便翻译了一下，Axios的文档还是很清晰明了的，看完文档后便可明白：

*  Axios请求失败后、响应失败后、请求发送前、响应返回后，请求超时时等这些情况的处理(拦截器)
* 怎么样对错误进行自定义处理(错误处理)
* 如何取消请求(Cancel token)
* 可以配置的选项参数(config)
* Axios配置的优先顺序
* async/await在Axios的使用方法
* Axios API的一些别名、缩写

> `注意` : Axios中分为两种数据传输的情况，一种是application/x-www-form-urlencoded格式下的params，一种是没有特别指明格式下的data,Axios默认是将数据以json格式传回，如果需要/user?id=xxx这种形式传回的话，则需要在config中添加params字段。

### 特性：

* 从浏览器生成XMLHttpRequests

* 从Node.js生成http requests

* 支持Promise Api

* 拦截请求和响应
* 转换请求和响应数据(比如说如果拦截到的result data里面还有错误码，则对错误码进行加工来返回一个合理的相应数据，无需在业务代码中调整)
* 关闭请求
* 自动转换JSON格式的数据
* 支持防范XSRF攻击（Client side ：客户端）

### 浏览器支持

| [![Chrome](https://camo.githubusercontent.com/26846e979600799e9f4273d38bd9e5cb7bb8d6d0/68747470733a2f2f7261772e6769746875622e636f6d2f616c7272612f62726f777365722d6c6f676f732f6d61737465722f7372632f6368726f6d652f6368726f6d655f34387834382e706e67)](https://camo.githubusercontent.com/26846e979600799e9f4273d38bd9e5cb7bb8d6d0/68747470733a2f2f7261772e6769746875622e636f6d2f616c7272612f62726f777365722d6c6f676f732f6d61737465722f7372632f6368726f6d652f6368726f6d655f34387834382e706e67) | [![Firefox](https://camo.githubusercontent.com/6087557f69ec6585eb7f8d7bd7d9ecb6b7f51ba1/68747470733a2f2f7261772e6769746875622e636f6d2f616c7272612f62726f777365722d6c6f676f732f6d61737465722f7372632f66697265666f782f66697265666f785f34387834382e706e67)](https://camo.githubusercontent.com/6087557f69ec6585eb7f8d7bd7d9ecb6b7f51ba1/68747470733a2f2f7261772e6769746875622e636f6d2f616c7272612f62726f777365722d6c6f676f732f6d61737465722f7372632f66697265666f782f66697265666f785f34387834382e706e67) | [![Safari](https://camo.githubusercontent.com/6fbaeb334b99e74ddd89190a42766ea3b4600d2c/68747470733a2f2f7261772e6769746875622e636f6d2f616c7272612f62726f777365722d6c6f676f732f6d61737465722f7372632f7361666172692f7361666172695f34387834382e706e67)](https://camo.githubusercontent.com/6fbaeb334b99e74ddd89190a42766ea3b4600d2c/68747470733a2f2f7261772e6769746875622e636f6d2f616c7272612f62726f777365722d6c6f676f732f6d61737465722f7372632f7361666172692f7361666172695f34387834382e706e67) | [![Opera](https://camo.githubusercontent.com/96d2405a936da1fb8988db0c1d304d3db04b8a52/68747470733a2f2f7261772e6769746875622e636f6d2f616c7272612f62726f777365722d6c6f676f732f6d61737465722f7372632f6f706572612f6f706572615f34387834382e706e67)](https://camo.githubusercontent.com/96d2405a936da1fb8988db0c1d304d3db04b8a52/68747470733a2f2f7261772e6769746875622e636f6d2f616c7272612f62726f777365722d6c6f676f732f6d61737465722f7372632f6f706572612f6f706572615f34387834382e706e67) | [![Edge](https://camo.githubusercontent.com/826b3030243b09465bf14cf420704344f5eee991/68747470733a2f2f7261772e6769746875622e636f6d2f616c7272612f62726f777365722d6c6f676f732f6d61737465722f7372632f656467652f656467655f34387834382e706e67)](https://camo.githubusercontent.com/826b3030243b09465bf14cf420704344f5eee991/68747470733a2f2f7261772e6769746875622e636f6d2f616c7272612f62726f777365722d6c6f676f732f6d61737465722f7372632f656467652f656467655f34387834382e706e67) | [![IE](https://camo.githubusercontent.com/4b062fb12353b0ef8420a72ddc3debf6b2ee5747/68747470733a2f2f7261772e6769746875622e636f6d2f616c7272612f62726f777365722d6c6f676f732f6d61737465722f7372632f617263686976652f696e7465726e65742d6578706c6f7265725f392d31312f696e7465726e65742d6578706c6f7265725f392d31315f34387834382e706e67)](https://camo.githubusercontent.com/4b062fb12353b0ef8420a72ddc3debf6b2ee5747/68747470733a2f2f7261772e6769746875622e636f6d2f616c7272612f62726f777365722d6c6f676f732f6d61737465722f7372632f617263686976652f696e7465726e65742d6578706c6f7265725f392d31312f696e7465726e65742d6578706c6f7265725f392d31315f34387834382e706e67) |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Latest ✔                                                     | Latest ✔                                                     | Latest ✔                                                     | Latest ✔                                                     | Latest ✔                                                     | 11 ✔                                                         |

![Browser Matrix](https://camo.githubusercontent.com/626c46cfd86214001b4143cda5d0ef27a25bd69f/68747470733a2f2f73617563656c6162732e636f6d2f6f70656e5f73617563652f6275696c645f6d61747269782f6178696f732e737667)

## 使用方法：

使用 npm:

```javascript
$ npm install axios
```

使用 浏览器:

```javascript
$ bower install axios
```

从 CDN引入:

```javascript
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

### 举个栗子：

#### 执行一个GET请求：

(Performing a `GET` request ------Performe [v] 表演、履行、办理，句子可以还原为Performing a GET request,the axios began do this.由主语axios发出的主动动作。如果动词和句子主语关系是被动的时候，就用ed形式，如果动词和句子主语是主动关系，同时暗含某种目的、计划等，用to do。同时ing形式成为动名词时，兼具动词和名次的特点。

```javascript
const axios = require('axios');

// 一个带query参数的用户请求
axios.get('/user?ID=12345')
  .then(function (response) {
    // 处理成功时的情况
    console.log(response);
  })
  .catch(function (error) {
    // 处理失败时的情况
    console.log(error);
  })
  .then(function () {
    // 总是执行
  });

// Optionally the request above could also be done as
// 以上的请求也可以像下面这样加入可选的参数
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // 总是执行
  });  

// 想使用 async/await?
async function getUser() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

**注意:** `async/await` 是ES2017的一部分且不被IE和比较远古的浏览器所支持, 使用的时候注意一下。

#### 执行多个并发请求：

(multiple [adj] 众多的、复杂/复合的、多种、concurrent [adj] 合流的 译为并发)

```javascript
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
    // Both requests are now complete
    // 两个请求现在已经完成
  }));
```

### Axios API

可以通过将相关配置传递给axios来进行请求

（relevant [adj] 相应的、贴题的、pass [v] 通过、经过、传递）

##### axios(config)

```javascript
// Send a POST request
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```

```javascript
// GET request for remote image
axios({
  method:'get',
  url:'http://bit.ly/2mTM3nY',
  responseType:'stream'
})
  .then(function(response) {
    response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
  });
```

##### axios(url[, config])

```javascript
// Send a GET request (default method)
axios('/user/12345');
```

#### 请求方法别名：

(alias [n] 别名，绰号)

* ##### axios.request(config)

* ##### axios.get(url[, config])

* ##### axios.delete(url[, config])

* ##### axios.head(url[, config])

* ##### axios.options(url[, config])

* ##### axios.post(url[, data[, config]])

* ##### axios.put(url[, data[, config]])

* ##### axios.patch(url[, data[, config]])

###### 注意：

在方法中使用 `url`, `method`, 和 `data` 别名时，这三个特性无需在config特别声明

(specify [v] 规定、提起)

#### 并发：

**Axios提供整合好的API来处理并发的请求**

* ##### axios.spread(callback)

* ##### axios.all(iterable)

#### 创建实例：

你可以使用自定义配置创建一个新的axios实例

(custom [adj] 自定义的)

```javascript
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
```

#### 实例方法：

下面列出了可用的实例方法，指定的配置将与实例的配置合并

* ##### axios#request(config)

* ##### axios#delete(url[, config])

* ##### axios#head(url[, config])

* ##### axios#options(url[, config])

* ##### axios#post(url[, data[, config]])

* ##### axios#put(url[, data[, config]])

* ##### axios#patch(url[, data[, config]])

* ##### axios#getUri([config])axios#get(url[, config])

#### 请求方法：

下面列出的是请求时可用的配置选项，只有`url`是必须的配置选项，当配置里面没有指定请求方法的时候默认为`GET`

```javascript
{
  // 请求的url，必填项
  url: '/user',

  // 请求方法，无该字段则默认为GET
  method: 'get', // default

  // `baseURL` 将被加在`url`字段的前面与`url`字符串拼接，除非`url`为绝对路径(be prepended to被添加到)
  // 有了`baseUrl`的存在为axios实例设置`baseURL`以传递相对URL可能会很方便(be convenient to 方便某事)
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` 允许在将请求数据发送到服务器之前对其进行更改
  // `transformRequest` 仅适用（applicable）于'PUT','POST'和'PATCH'请求
  // 数组中的最后一个函数必须返回一个字符串或者一个Buffer实例
  // FormData 或者 Stream的时候，你可能需要修改headers对象
  transformRequest: [function (data, headers) {
    // 关于数据转换的函数
    return data;
  }],

  // `transformResponse` 允许response数据在服务器传回后在`transformResponse`函数中先预处理。
  // 可被then/catch传递
  transformResponse: [function (data) {
    // 关于数据转换的函数
    return data;
  }],

  // `headers` 可被自定义
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` 和请求一起发送的url参数，常用于application/x-www-form-urlencoded格式下，传输的数据形式为url?params
  // 必须是一个普通对象或者URLSearchParams对象
  params: {
    ID: 12345
  },

  // `paramsSerializer` 是一个负责序列化转换的可选功能 `params`
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function(params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` 是要作为请求正文发送的数据
  // 仅适用于'PUT', 'POST', 和 'PATCH'方法
  // 当没有设置 `transformRequest`时, 其必须为以下类型之一:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - Browser only: FormData, File, Blob
  // - Node only: Stream, Buffer
  data: {
    firstName: 'Fred'
  },

  // `timeout` 指定服务器请求超时时间之前的的超时毫秒数
  // 如果请求时长超过 `timeout`的设定值, 该请求将被中止.
  timeout: 1000, // 默认为 `0` (没有超时时间)

  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // `withCredentials`表示是否跨域访问控制请求
  // 应该使用凭证
  withCredentials: false, // default

  // `adapter` 允许自定义处理请求，使测试更容易
  // Return a promise and supply a valid response (see lib/adapters/README.md).
  // 返回一个promise并提供一个有效的响应(查看 lib/adapters/README.md)
  adapter: function (config) {
    /* ... */
  },

  // `auth` 表示应该使用HTTP Basic身份验证，并提供凭据.
  // 这将会设置一个 `Authorization` header, 覆盖任何现有的header
  // `Authorization` 是您已设置的自定义 `headers`.
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

  // `responseType` 表示服务器将响应的数据类型
  // 可选项为 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // 默认为json格式
  // `responseEncoding` 表示用于解码response的编码
  // Note: 忽略'stream' 或者 client-side 请求的`responseType`
  responseEncoding: 'utf8', // 默认为utf8

  // `xsrfCookieName` 是用作xsrf token值的cookie名称
  xsrfCookieName: 'XSRF-TOKEN', // 默认为XSRF-TOKEN

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  // `xsrHeaderName`是带有xsrf token值的http header的名称
  xsrfHeaderName: 'X-XSRF-TOKEN', // 默认为X-XSRF-TOKEN

  // `onUploadProgress` allows handling of progress events for uploads
  // `onUploadProgress`允许处理上传的进度事件
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` allows handling of progress events for downloads
  // `onDownloadProgress` 允许处理下载的进度事件
  onDownloadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `maxContentLength` defines the max size of the http response content in bytes allowed
  // `maxContentLength` 定义http相应内容的最大大小(单位:字节bytes)
  maxContentLength: 2000,

  // `validateStatus` defines whether to resolve or reject the promise for a given
  // `validateStatus` 定义是否resolve或reject给定的promise
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  // HTTP响应状态码，如果validateStatus返回为true/null/undefined，promise将会被resolved，否则，promise将会被rejected
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // `maxRedirects` defines the maximum number of redirects to follow in node.js.
  // `maxRedirects` 定义在node.js环境中要遵循的最大重定向数
  // If set to 0, no redirects will be followed.
  // 如果设置为0，则没有重定向将会被执行
  maxRedirects: 5, // default

  // `socketPath` defines a UNIX Socket to be used in node.js.
  // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
  // Only either `socketPath` or `proxy` can be specified.
  // If both are specified, `socketPath` is used.
  // `socketPath`定义了一个在Node.js使用的Unix Socket，比如说 '/var/run/docker.sock'将会被请求发送到docker daemon，只能指定socketPath或者proxy中的一项，如果都指定了，那么以socketPath为准。
  socketPath: null, // default

  // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
  // and https requests, respectively, in node.js. This allows options to be added like
  // `keepAlive` that are not enabled by default.
  // 定义了执行http时要使用的自定义代理和Node.js中的https请求，允许像keepAlive这样的可选字段加入(keepAlive默认情况下不启用)
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // 'proxy' defines the hostname and port of the proxy server.
  // You can also define your proxy using the conventional `http_proxy` and
  // `https_proxy` environment variables. If you are using environment variables
  // for your proxy configuration, you can also define a `no_proxy` environment
  // variable as a comma-separated list of domains that should not be proxied.
  // Use `false` to disable proxies, ignoring environment variables.
  // `auth` indicates that HTTP Basic auth should be used to connect to the proxy, and
  // supplies credentials.
  // This will set an `Proxy-Authorization` header, overwriting any existing
  // `Proxy-Authorization` custom headers you have set using `headers`.
  // 定义代理服务器的主机名和端口
  // 你可以使用传统的`http_proxy`和`https_proxy`环境变量来定义代理。 如果你使用环境变量进行代理配置，则还可以定义“no_proxy”环境
  // 变量作为不应被代理的以逗号分隔的域列表。
  // 使用`false`来禁用代理，忽略环境变量。
  //`auth`表示HTTP Basic auth应该用于连接代理，并提供凭证。这将设置一个`Proxy-Authorization` header，覆盖你用`header`设置的任何现有`Proxy-Authorization`自定义header文件。
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // `cancelToken` 指明一个可以被用于取消请求的 cancel token
  // (查看 Cancellation 段落下的细节)
  cancelToken: new CancelToken(function (cancel) {
  })
}
```

#### Response：

response包含以下信息：

```javascript
{
  // `data` is the response that was provided by the server
  data: {},

  // `status` is the HTTP status code from the server response
  status: 200,

  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',

  // `headers` the headers that the server responded with
  // All header names are lower cased
  headers: {},

  // `config` is the config that was provided to `axios` for the request
  config: {},

  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance the browser
  request: {}
}
```

当使用`then`的时候，则会收到如下response

```javascript
axios.get('/user/12345')
  .then(function(response) {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  });
```

当使用catch或传递 rejection callback 作为当时的第二个参数时，response将通过error对象提供，如“[Handling Errors](https://github.com/axios/axios#handling-errors)”部分中所述。

#### 默认配置：

你可以指定一个被所有的请求使用的默认配置

##### Axios全局默认配置

```javascript
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```

##### 自定义的实例默认配置

```
// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: 'https://api.example.com'
});

// Alter defaults after instance has been created
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
```

##### 配置的优先权顺序

1.Axios默认配置(存储于lib/defaults.js)

2.实例的默认配置

3.Axios请求时附加的配合

优先权逐级上升，优先权低的配置会被高配置所覆盖/合并。

#### 拦截器：

你可以在请求或者响应被`then`或者`catch`处理之前拦截他们并在方法中做一些事情

```javascript
// 加入请求的拦截器
axios.interceptors.request.use(function (config) {
    // 在请求发送之前做些什么
    return config;
  }, function (error) {
    // 在请求失败的时候做些什么
    return Promise.reject(error);
  });

// 加入响应的拦截器
axios.interceptors.response.use(function (response) {
    // 在响应成功的时候做些什么
    return response;
  }, function (error) {
    // 在响应错误的时候做些什么
    return Promise.reject(error);
  });
```

如果你需要删除掉拦截器那么在调用完成后你可以：

```javascript
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```

你可以添加拦截器到自定义的axios实例

```javascript
const instance = axios.create();
instance.interceptors.request.use(function () {/*...*/});
```

#### 处理错误：

```javascript
axios.get('/user/12345')
  .catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // 请求已完成，服务器响应状态代码
      // that falls out of the range of 2xx
      // code码超出了2xx的范围
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // 请求了但是没有收到任何回复
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // `error.request`是浏览器中XMLHttpRequest的一个实例
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      // 如果没有error.response，那么应该会有一个关于错误的message值传回来作为错误解释
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
```

你可以使用ValidateStatus配置选项定义一个自定义的HTTP状态码错误范围：

```javascript
axios.get('/user/12345', {
  validateStatus: function (status) {
    return status < 500; // 仅在状态大于或等于500时拒绝
  }
})
```

#### 取消请求：

你可以使用*cancel token*来取消一个请求

Axios cancel token API基于withdrawn [cancelable promises proposal](https://github.com/tc39/proposal-cancelable-promises)

你可以使用CancelToken.source工厂创建或者删除token，如下所示

```javascript
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function(thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // 处理错误
  }
});

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})

// 关闭请求 (the message parameter is optional  message参数是可选的)
source.cancel('Operation canceled by the user.');
```

你还可以通过执行函数传递给CancelToken constructor(构造函数)来创建或者取消token

```javascript
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // 执行函数收到一个取消的函数作为参数
    cancel = c;
  })
});
// 关闭请求
cancel();
```

*注意*：你可以使用相同的cancel token 来取消多个请求

#### 使用application/x-www-form-urlencoded格式(url传参)

Axios会默认将JS中的object对象序列化为JSON格式的数据。如果你使用application/x-www-form-urlencoded格式发送数据，你可以使用以下选项之一。

##### 浏览器：

在浏览器中，你可以使用[`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)API如下所示:

```javascript
const params = new URLSearchParams();
params.append('param1', 'value1');
params.append('param2', 'value2');
axios.post('/foo', params);
```

请注意：并非所有浏览器都支持URLSearchParams（请参阅[caniuse.com](http://www.caniuse.com/#feat=urlsearchparams)），但有可用的[polyfill](https://github.com/WebReflection/url-search-params)（确保填充全局环境）。

##### 另外，你可以使用[`qs`](https://github.com/ljharb/qs)数据库对数据进行编码:

```javascript
const qs = require('qs');
axios.post('/foo', qs.stringify({ 'bar': 123 }));
```

##### 或者，使用ES6:

```
import qs from 'qs';
const data = { 'bar': 123 };
const options = {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  data: qs.stringify(data),
  url,
};
axios(options);
```

#### Node.js

在node.js中，你可以使用querystring模块如下所示:

```javascript
const querystring = require('querystring');
axios.post('http://something.com/', querystring.stringify({ foo: 'bar' }));
```

可以使用[`qs`](https://github.com/ljharb/qs)数据库

#### Promises

axios依赖于支持的本机ES6 Promise实现。 如果你的环境不支持ES6 Promises，您可以[polyfill](https://github.com/jakearchibald/es6-promise)。