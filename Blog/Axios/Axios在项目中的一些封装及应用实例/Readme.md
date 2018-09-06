## Axios在项目中的一些封装及应用实例

* **拦截器(请求失败后、响应失败后、请求发送前、响应返回后)**
* **取消请求**
* **超时处理**
* **配置覆盖**

> `前置条件`:服务端与Web端约定好的返回值数据格式为
>
> ```javascript
> {
>     "data": {},
>     "resultStatus": {
>     	"code": 0,
>         "msg": "string",
>         "msgKey": "string",
>         "sourceCode": "string",
>         "sourceMsg": "string"
>     }
> }
> ```
>
> 服务端与Web端约定好的header名为'ACCESS_TOKEN'
>
> `基本配置`:
>
> ```javascript
> axios.defaults.timeout = TIMEOUT
> axios.defaults.headers.post[CONTENT_TYPE_HEADER] = CONTENT_TYPE
> axios.defaults.retry = 1
> axios.defaults.retryDelay = 100
> axios.defaults.CancelToken = axios.CancelToken.source().token
> axios.defaults.baseURL = DEFAULT_REQUEST_URL
> ```

### 1.配置覆盖

#### 配置的优先权顺序

①Axios默认配置(存储于lib/defaults.js)

②实例的默认配置

③Axios请求时附加的配置

优先权逐级上升，优先权低的配置会被高配置所覆盖/合并。

文章开头的默认配置对应②的权限，相当于将Axios默认的配置覆盖掉。

在拦截器(Interceptor)中使用config.xxx = xxxx这种写法属于Axios请求时附加的配置，最高权限。

### 2. 对拦截器(Interceptor)的应用

一个完整的Ajax请求，必定有`request`和`response`这两个过程，而如果在这两个过程中出现异常情况，就需要我们对`request`、`response`的失败，`request`发送前，`response`返回后有个异常情况处理，拦截器便是为此而生。

#### ①请求发送前：

只要是涉及到有登录功能的网站，那就必然会让用户有个`token(令牌)`，用于代表这个用户在服务中的身份标识，以供服务器提供针对性的信息。

在业务代码中，要是每次涉及到登录权限的请求都带上一个token参数，当大量的功能都需要用户登录才可使用的时候，每一次Axios请求都要开发者手动加上token值就会显得非常繁琐以及含有大量重复性的工作，亢长的代码显然也不利于阅读，自然是不利于我们对“懒”的追求。

```javascript
const AUTH_HEADER = 'ACCESS_TOKEN' // 进行登录认证的header名
// 取得token
function getAccessToken (store) {
  return store.state.common.token || sessionStorage.getItem(AUTH_HEADER)
}
export default function (axios, store) {
    axios.interceptors.request.use(function(config){
      let accessToken = getAccessToken(store)
      if (accessToken) {
        config.headers[AUTH_HEADER] = accessToken
      }
      return config
    })
}
```

#### ②响应返回后（包含超时处理）

这里可以做的事情就比较多：

* 接口切换及兼容，开发的过程中可能有些后端未完成的接口需要开发接口/mock接口混用

* 超时重复尝试
* 响应返回，关闭自定义的加载框
* 剩下的不一一列举

```javascript

export default function (axios, store, httpRequest) {
  axios.interceptors.response.use(
    function (response) {
      loading.hide(response && response.config)
      let isOldMock = response.request.responseURL.indexOf('rap2api.taobao.org') !== -1 &&
        response.request.responseURL.indexOf('microservice') === -1
      // 兼容原来的接口数据格式,未来可能删掉
      if (isOldMock || (response.config && response.config.isUseRawData)) {
        return response
      }

      // 这里的_vm并非vuex暴露出来的接口，但为了不导致其它模块的大面积的修改，也只能先这样做了
      // reject的时候遵守axios的error定义：包含request, response, message三者之一
      if (response.data) {
        let resultStatus = response.data.resultStatus
        // 只有这样才是成功的，其它都是失败的
        if (resultStatus) {
          return normalProcess(response, resultStatus)
        }
      }

      return Promise.reject(createError({
        response
      }))
    },
    function (error) {
      let config = error && error.config
      // 关闭弹框,即使重试也要关，否则计数会有错误，导致重试后弹框关不掉
      loading.hide(config)

      // 如果没有config或者没有config.retry这个属性，直接抛出异常
      if (!config || !config.retry) {
        return Promise.reject(error)
      }
      // 如果没有config.__retryCount，则赋值为0
      config.__retryCount = config.__retryCount || 0
      // Check if we've maxed out the total number of retries
      // 如果重试次数大于定义的重复次数，则抛出异常，结束。
      if (config.__retryCount >= config.retry) {
        return Promise.reject(error)
      }

      // Increase the retry count
      // 如果重试没有大于重复请求次数，则+1
      config.__retryCount += 1

      // Create new promise to handle exponential backoff
      // 如果没有定义默认的retryDelay，则为1ms后重新请求
      let backoff = new Promise(function (resolve) {
        setTimeout(function () {
          resolve()
        }, config.retryDelay || 1)
      })

      // Return the promise in which recalls axios to retry the request
      // 重复请求执行
      return backoff.then(function () {
        // 使用封装过的函数，不直接使用axios
        return httpRequest(config)
      })
    }
  )
}
```

#### ③请求/响应失败后：

即使前端与后端开发前约定的再详细，也很难确保后端传回的错误信息符合前端的需求，而要是接到再开发的项目那么这种问题出现的就更明显，实际上请求失败后可以做很多事情，这个根据自己实际业务需求来决定，这里我只讲到对错误信息的一些封装。

而响应失败，一般是因为服务器的原因，这里也一并列举。

```javascript
export default function (axios, vueInstance, store) {
    // 注册一下vue实例，以免到处要传参
  vm = vueInstance
  return function request () {
      return axios(...arguments).then(data => {
          // 成功后做些什么
          return data
      },error=>{
          //失败后做些什么
          let errorMessage // 这个是错误信息
          if (error && error.response) {
            // NO_TOAST是模块内的变量,用于配置是否不自动弹出错误提示
            NO_TOAST = error.response.config && error.response.config.noToast
            const statusCode = error.response.status

            // 有返回的时候
            if (statusCode === 401) {
              // 需要登录,后面的弹出信息逻辑就不用走了，因此return
              return redirectToLogin(error, store, vm)
            } else if (statusCode === 403) {
              // 没有权限
              errorMessage = buildErrorMessage('您无权进行此操作，请在客服中联系客户经理', statusCode)
            } else if (statusCode >= 500 && statusCode < 600) {
              // 500错误
              errorMessage = buildErrorMessage('服务器异常，请稍候重试', statusCode)
            } else {
              // 其它
              errorMessage = buildErrorMessage(error.message || '连接服务器异常，请稍后再试', statusCode)
            }
          } else if (error.request) {
            // 没返回，有请求的时候
            errorMessage = buildErrorMessage('连接服务器异常，请稍后再试', 'R1')
          } else if (error.message) {
            // 没返回，没请求的时候
            errorMessage = buildErrorMessage(error.message, 'R0')
          } else {
            // 使用cancelToken取消axios请求时进入
            errorMessage = ''
          }
          // 如果需要覆盖原来的信息，可以在这里统一操作
          error.message = errorMessage // 设置默认的错误提示语，以防止显示英文的提示语
          return Promise.reject(error)
      })
    }
}
```

### 3.取消请求

你可以使用*cancel token*来取消一个请求

Axios cancel token API基于withdrawn [cancelable promises proposal](https://github.com/tc39/proposal-cancelable-promises)

使用CancelToken.source工厂创建或者删除token，如下所示

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

结合业务:

**Axios**:

```javascript
axios.interceptors.request.use(
    function (config) {
        if (config.Loading) {
            config.cancelToken = new CancelToken(function executor (c) {
                // 执行函数收到一个取消的函数作为参数
                store.commit('SET_REQUESTCANCEL', c)
            })
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
  )
```

**router(路由守卫)**:

下面代码示例的内容含封装函数，其实代码的意思就是在路由切换前取消掉axios请求。

```javascript
/**
 * 路由转换时Axios行为处理
 * @module guard/axios
 */
var VUE_ROUTER

function beforeEach(to, from, next) {
  let vm = VUE_ROUTER.app
  //路由变化时，取消所有axios请求
  let cancel = vm.$store.getters.requestCancel
  if (cancel) {
    cancel()
  }
  next()
}
export default {
  guard(router) {
    VUE_ROUTER = router
    router.beforeEach(beforeEach)
  }
}
```

