## Axios—静默请求队列化

### 前言

前后端交互的过程中，Ajax请求必不可少，而在项目中一般分为以下两种：

* 静默请求（一般用于频繁的请求一些状态类数据来满足每个页面不同样式上的展示）
* 主动请求（一般这类请求都会带个Loading来提示用户其数据正在提交中/返回中）

如果是单页应用，那么路由切换是必不可少的，有些Ajax请求可能在每个路由切换的时候都需要静默去帮用户请求相同的数据来实现类似Websocket的长链接状态。（为什么不直接用Websocket，因为总有这或者那的原因，服务端暂时做不了Websocket，只能前端自己优化一下）

当网络很差或者说测试在测的时候，可能会对路由进行一个比较快速的切换，这个时候静默请求就会不断发送给客户端，这样不但增加了服务端的负担，在网络较差的环境下如果各位有对超时有个弹Toast的通用处理的话，这个时候可能就会不停的弹Toast来提示用户网络错误，虽然触发的条件比较苛刻，或者说可以在加载的时候不让用户做任何操作的用户体验牺牲来平衡，但如果可以在请求没有返回结果之前，同样的请求不会再继续发出，这样就能够很好的解决这个问题。

我们知道Axios中确实可以做到请求没有返回结果之前不再提示，只需在该请求定义一个布尔值变量，类似于我们队主动提交时可能会存在连点的处理，当请求执行中时判断布尔值，当请求结束后重置布尔值，这样也能够很好的解决这个问题，但是一个项目中静默请求可能会很多，而且都分布在不停的模块文件内，如果在项目中后期才意识到这种事情，需要改动的时候难免就比较麻烦和容易造成代码冗余。

### 思路

鉴于此我决定弄一个类似队列的一种方法：创建一个数组，内含静默请求的url，当静默请求结束时将url从数组中移除，当静默请求进行时，url存在于数组中，这样如果在切换路由的时候还有相同的请求，那么请求会被取消，需等待队列中的请求结束后才能再次请求。

### 实践

> 在项目中我们的Axios请求中已近引入了Store变量，这意味着我们可以拿到Store中的状态。

首先我们在Vuex中加入存储Axios请求的数组及改变该数组的方法

**Store**

```javascript
const state ={
    ajaxQueue: []
}
const getters = {
    ajaxQueue: state => state.ajaxQueue
}
const mutations={
  //设置ajax请求队列
  [types.SET_AJAXQUEUE_URL](state, res) {
    state.ajaxQueue = res
  }
}
```

**Axios**

请求时拦截器

在请求的时候，添加请求到队列中，如果当前队列已有该静默请求，则取消请求。

```javascript
//静默请求队列化处理函数
function handleAjaxQueue (store, config) {
    let ajaxQueue = store.getters.ajaxQueue
    if (ajaxQueue.indexOf(config.baseURL + config.url) > -1) {
        return false
    } else {
        ajaxQueue.push(config.baseURL + config.url)
        store.commit('SET_AJAXQUEUE_URL', ajaxQueue)
        return true
    }
}
export default function (axios, store) {
    const CancelToken = axios.CancelToken
    axios.interceptors.request.use(
        function(config){
            //这里我们是用配置中自定义字段Loading来判断是主动请求/静默请求
            if (config.Loading) {
                // do something...
            } else {
                //请求为静默请求时
                if (!handleAjaxQueue(store, config)) {
                    config.cancelToken = new CancelToken(function executor (c) {
                        // 执行函数收到一个取消的函数作为参数
                        let cancel = c
                        console.log('请求正在队列中，该次请求被取消')
                        cancel('')
                    })
                }
            }
        },
        function(error){
            // 对请求错误做些什么
            return Promise.reject(error)
        }
    )
}
```

响应时拦截器

在响应的时候，如果队列中有响应的url，则删除队列中对应的url，确保流程可以顺利进行。

```javascript
// 静默请求队列化函数-响应时
function deleteAjaxQueue (response, store) {
  if (response.config && response.config.url) {
    let ajaxQueue = store.getters.ajaxQueue
    let index = ajaxQueue.indexOf(response.config.url)
    if (index > -1) {
      ajaxQueue.splice(index, 1)
      store.commit('SET_AJAXQUEUE_URL', ajaxQueue)
    }
  }
}
export default function (axios, store, httpRequest) {
  axios.interceptors.response.use(
    function (response) {
      // 删除已有队列
      deleteAjaxQueue(response, store)
      return Promise.reject(createError({
        response
      }))
    },
    function (error) {
      // do something...
    }
  )
}
```

### 注意事项：

> 因为使用cancelToken取消掉请求会触发请求错误，这里希望各位注意一下不是取消掉请求就可以万事大吉啦，如果你们还做了错误统计把Ajax的错误也统计进去了，那么这一块可能需要各位额外处理一下。

### 总结：

`优点`：路由切换时触发的通用状态请求不会再重复请求增加服务器的负担，如果前端做通用的ajax超时/错误返回时考虑的问题也会少一些。

`缺点`：各位童鞋应该都用过很多APP，如果某个数据长时间loading都没有返回时大家可以取消掉该loading再请求一次这样数据可能马上就返回回来了。

而如果做了这种限制的话，可能会导致通用数据loading的过久切换多个路由都没有更新，对于这种情况，我们也在持续观察和准备优化。