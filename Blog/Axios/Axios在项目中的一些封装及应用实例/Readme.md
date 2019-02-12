# 从头开始撸一个适用于自己项目的axios封装

## 1.明确封装内容

* 对于每一个请求都会有一个true/false值记录其是否在进行中
* 错误跟踪
* 服务端传回的code码有对应的前端提示语句
* 对于正在进行的请求有重复校验，重复请求将会被取消
* 对应各种错误状态可以进行额外处理

## 2.基本的封装

首先我们仅仅是在axios的基础上封装我们需要的功能，调用的API应该是与axios保持一致的。

```javascript
import axios from 'axios'
class AxiosPackage {
  get package () {
    return this.$http
  }
  constructor (config) {
    //设置axios.defaults
    this.setAxiosDefault(config)
    //封装axios
    this.packageAxios()
    //使用拦截器
    this.interceptors()
  }
  // 封装axios请求
  packageAxios () {
    this.requestArray = []
    this.$http = config => {
      return axios(config).then(data => {
        return data
      }, error => {
        return Promise.reject(error)
      })
    }
    let method = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch']
    method.map(item => {
      this.packageMethods(item)
    })
  }
  // 封装axios对应的请求方法
  packageMethods (method) {
    this.$http[method] = () => {
      return arguments.length > 2 ? axios({ url: arguments[0], method: method, data: arguments[1], ...arguments[2] }) : axios({ url: arguments[0], method: method, ...arguments[1] })
    }
  }
}
```

是不是发现缺少了些什么？我们还缺少拦截器interceptors和axios.defaults配置，下面开始对axios.defaults进行设置。

```javascript
setAxiosDefault (config) {
    this.config = config
    Object.keys(config).map(item => {
      if (typeof config[item] === 'object') {
        Object.keys(config[item]).map(items => {
          if (!axios.default.hasOwnProperty(item)) {
            axios.defaults[item] = config[item]
          }
          axios.defaults[item][items] = config[item][items]
        })
      } else {
        axios.defaults[item] = config[item]
      }
    })
    //实际上就是在做axios.defaults.xx = xxx这样的操作
}
```

> 在constructor中，我们选择了config默认配置作为参数，也就是说在调用这个构造函数时，我们将config传入，那么在setAxiosDefault(config)中`config`即为传入的config

至此，一个简单的axios封装就完成了

```javascript
let HTTP = new AxiosPackage({
  timeout: 10000,
  headers: {
    post: {
      'Content-Type': 'application/x-www-form-urlencoded',
      IDENTIFY: 'OACCOUNT_WEB' //博主的项目特有，无需关注
    }
  }
})
export const $http = HTTP.$http
```

### 3.取消重复请求及获知请求状态

当然，光有上面这些还不够，我们实际使用的过程中，肯定有很多想在request/response的过程中需要控制的内容，比如说对重复请求的控制，想要在项目中知道是否对用户显示该请求loading gif。

在packageAxios、packageMethods、interceptors、handleRequestArray函数中，我们进行如下处理:

```javascript
// 封装axios请求
packageAxios () {
    this.requestArray = []
    this.$http = config => {
        if (this.requestArray.includes(config.url)) {
            let error = '取消重复请求'
            return Promise.reject(error)
        }
    ....
    }
    this.requestProcessObj = {}
}
// 封装axios对应的请求方法
packageMethods (method) {
    this.$http[method] = () => {
      if (this.requestArray.includes(arguments[0])) {
        let error = '取消重复请求'
        return Promise.reject(error)
      }
     ....
    }
}
// 对请求队列及请求对应的状态进行处理
handleRequestArray (config, mode) {
    // 请求时，requestArray push该请求url
    if (mode === 'request') {
      this.requestArray.push(config.url)
      this.$http.requestProcessObj[config.url] = true
    } else {
      // error或者response时，requestArray删除该请求的url
      this.requestArray.includes(config.url) ? this.requestArray.splice(this.requestArray.indexOf(config.url), 1) : this.requestArray = []
      this.$http.requestProcessObj[config.url] = false
    }
}
// 在请求或响应被 then 或 catch 处理前拦截它们
interceptors () {
    // axios请求拦截器
    axios.interceptors.request.use(config => {
      this.handleRequestArray(config, 'request')
      return config
    }, error => {
      this.handleRequestArray(error.config, 'error')
      return Promise.reject(error)
    })
    // axios响应拦截器
    axios.interceptors.response.use(response => {
      this.handleRequestArray(response.config, 'response')
      // 未知异常状态直接回传response
      if (!(response.data && response.data.code)) {
        return Promise.reject(Error(response))
      }
      // 成功则直接回传response或者是config中定义的response
      if (this.config.code.SUCCESS.includes(response.data.code)) {
        return response
      }
    }, error => {
      this.handleRequestArray(error.config || error.response.config || error, 'error')
      return Promise.reject(error)
    })
  }
```

ok，这样对重复请求的控制及通过`this.requestProcessObj[url]`获知请求状态的封装就完成了。

### 4.根据后端自定义的错误码进行处理

在博主的项目中，后端对错误业务的处理会有自己的一套code码，在请求的时候statusCode返回始终是200，这样我们上述的封装肯定是无法进入到Promise.reject中。而且错误回来之后需要怎么提示用户呢？（博主使用mint-ui中的toast提示用户）

> 博主思索了一会还是决定将hint和code对应情况扔进defaultConfig中
>
> ```javascript
> defaultConfig:{
>   ...
>   code: {
>     SUCCESS: ['0'],
>     'NEED_LOGIN': ['10', '11', '12', '13'], //需要登录
>     'SERVER_ERROR': ['900'], //系统错误
>     'NEED_CERTIFICATE': ['90001'], //需要凭证
>     'NO_PERMISSION': ['90003'] //没有权限
>   },
>   hint: {
>     '10': '登录超时，请重新登录',
>     '11': '请登录后访问该页面',
>     '12': '长时间未操作，请重新登录',
>     '900': '服务器异常，请稍后重试',
>     '90001': '服务器异常，请稍后重试',
>     '90003': '您暂无权限访问，请联系管理员',
>     'default': '服务器异常，请稍后重试'
>   }
> }
> ```
>
> 关于提示，博主琢磨着在各种项目中通用，其他项目中不一定使用到这个toast，所以也是扔到了defaultConfig中，作为配置使用。
>
> ```javascript
> import toast from './toast'
> deafultConfig:{
>     ....
>     toast: ({ message, iconClass }) => {
>         return toast({
>           message: message,
>           iconClass: iconClass || ''
>         })
>     }
> }
> ```

对这种情况我们就需要进行一定的处理

```javascript
// 错误生成
  createError ({ message, response }) {
    let error = new Error(message)
    error.response = response
    return error
  }
// 创建提示（错误、警告、成功)
  createTips (message, iconClass) {
    //相对于mint-ui原版的toast，我是直接截取下来做了改动(新冒泡会直接取消掉旧冒泡，message可以传html、icon改为淘宝iconfont的svg引用方式iconClass)
    this.config.toast({ message, iconClass })
  }
// 在请求或响应被 then 或 catch 处理前拦截它们
  interceptors () {
    .... //request拦截，这里忽略，上文有
    axios.interceptors.response.use(response => {
      // 未知异常状态直接回传response
      if (!(response.data && response.data.code)) {
        return Promise.reject(this.createError({
          response
        }))
      }
      // 成功则直接回传response或者是config中定义的response
      if (this.config.code.SUCCESS.includes(response.data.code)) {
        return response
      } else if (this.config.code['NEED_LOGIN'].includes(response.data.code)) {
        // 需要登录时抛出登录语句且直接跳进登录页
        this.JumpLogin() //跳转到登录页面所需函数，自行调整，本文不提供
        return Promise.reject(this.createError({
           //关于后端自定义code，博主项目中后端固定传在response.data.code中，这算是一个定制性很强的东西，本应该作为配置项在defaultConfig中，不过这次没有抽取出来
          message: this.config.hint[response.data.code],
          response
        }))
      } else {
        this.handleRequestArray(error.config || error.response.config || error, 'error')
        // 出现错误时抛出异常
        return Promise.reject(
          //关于错误message，博主项目中后端固定传在response.data.message中，这算是一个定制性很强的东西，本应该作为配置项在defaultConfig中，不过这次没有抽取出来。
          this.createError({
            message: response.data.message || this.config.hint['default'],
            response
          })
        )
      }
    }, error => {
      this.handleRequestArray(error.config || error.response.config || error, 'error')
      this.createTips(error.message)
      return Promise.reject(error)
    })
  }
```

至此，对后端自定义错误code码的处理完成

### 5.提取config

博主是将axios.defaults的配置抽取到一个config.js的文件中

```javascript
import toast from '@/components/toast'
export default {
  timeout: 10000,
  headers: {
    post: {
      'Content-Type': 'application/x-www-form-urlencoded',
      IDENTIFY: 'OACCOUNT_WEB'
    }
  },
  responseReturn: response => {
    return response.data.data
  },
  code: {
    SUCCESS: ['0'],
    'NEED_LOGIN': ['10', '11', '12', '13'],
    'SERVER_ERROR': ['900'],
    'NEED_CERTIFICATE': ['90001'],
    'NO_PERMISSION': ['90003']
  },
  hint: {
    '10': '登录超时，请重新登录',
    '11': '请登录后访问该页面',
    '12': '长时间未操作，请重新登录',
    '900': '服务器异常，请稍后重试',
    '90001': '服务器异常，请稍后重试',
    '90003': '您暂无权限访问，请联系管理员',
    'default': '服务器异常，请稍后重试'
  },
  toast: ({ message, iconClass }) => {
    return toast({
      message: message,
      iconClass: iconClass || ''
    })
  }
}
```

调用

```javascript
import defaultConfig from './config'
let HTTP = new AxiosPackage(defaultConfig)
export const $http = HTTP.$http
```



