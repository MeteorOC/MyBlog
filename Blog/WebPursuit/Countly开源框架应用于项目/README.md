## Countly开源框架应用于项目

### 封装

**基本API**

Countly文档内提供了一些API调用方法，比如说加入想要统计用户信息，以下为例子：

```javascript
Countly.q.push(['user_details',{
    "name": "Arturs Sosins",
    "username": "ar2rsawseen",
    "email": "test@test.com",
    "organization": "Countly",
    "phone": "+37112345678",
    //Web URL to picture
    "picture": "https://pbs.twimg.com/profile_images/1442562237/012_n_400x400.jpg", 
    "gender": "M",
    "byear": 1987, //birth year
    "custom":{
      "key1":"value1",
      "key2":"value2",
      ...
    }
}]);
```

想要修改这些用户信息也可以，比如说增加当前值或其他存储数值组：

```javascript
Countly.q.push(['userData.set', key, value]) //set custom property
Countly.q.push(['userData.set_once', key, value]) //set custom property only if property does not exist
Countly.q.push(['userData.increment', key]) //increment value in key by one
Countly.q.push(['userData.increment_by', key, value]) //increment value in key by provided value
Countly.q.push(['userData.multiply', key, value]) //multiply value in key by provided value
Countly.q.push(['userData.max', key, value]) //save max value between current and provided
Countly.q.push(['userData.min', key, value]) //save min value between current and provided
Countly.q.push(['userData.push', key, value]) //add value to key as array element
Countly.q.push(['userData.push_unique', key, value]) //add value to key as array element, but only store unique values in array
Countly.q.push(['userData.pull', key, value]) //remove value from array under property with key as name
Countly.q.push(['userData.save']) //send userData to server
```

---

**JavaScript错误追踪**

```javascript
Countly.q.push(['track_errors'])
```

还可以添加更多的分字段或属性，通过提供一个object/键值对添加到错误报告

```javascript
Countly.q.push(['track_errors', {
	"facebook_sdk": "2.3",
	"jquery": "1.8"
}])
```

除了自动报告未处理的错误，也可以报告处理例外的错误以方便稍后处理。并且你可以选择再次提供在报告中使用的自定义字段(或使用 **track_error** 方法）。

```javascript
// Countly.log_error(error, segments);
try{
	//do something here
}
catch(ex){
	//report error to Countly
  Countly.q.push(['log_error', ex]);
}
```

为了进一步了解用户遇到错误之前的行为，可以在代码中埋下breadcrumbs，这些breadcrumbs将结合在一个日志中。

```javascript
Countly.q.push(['add_log', "user clicked button a"]);
```

---

**修改设备 ID**

在某些情况下，您可能需要修改用户的ID，例如当用户换了ID。

```javascript
Countly.q.push(['change_id', "myNewId"]);
```

ID换了，那么数据可能要合并，以便跟踪用户跨设备的行为

```javascript
Countly.q.push(['change_id', "myNewId", true]);
```

---

**在Webview中使用Web SDK(一般用于native app)**

①确保Webview启用了JavaScript、本地存储

```javascript
// Android
myWebView.getSettings().setJavaScriptEnabled(true);
myWebView.getSettings().setDomStorageEnabled(true);
myWebView.getSettings().setDatabaseEnabled(true);
if (Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT) {
    myWebView.getSettings().setDatabasePath("/data/data/" + myWebView.getContext().getPackageName() + "/databases/");
}
```

②初始化

* 通过加入初始化代码以延迟初始化Countly
* 在Webview不跟踪会话，因为它们是Native app跟踪
* 一旦WebView加载，把device_id发送到webview ，然后开始初始化
* 在Native App方面，你需要在WebView调用JavaScript功能，发送device_id。

`初始化`中已含有初始化的代码，如有疑惑请前去查看。

---

更多请参考[Countly开源框架使用说明](https://resources.count.ly/v2.0/docs/web-analytic-javascript#section-%E8%B7%9F%E8%B8%AAjavascript%E9%94%99%E8%AF%AF)

根据上述结合项目实际，我们封装了如下两个JS文件

**APIBasic.js**、**APIAdvanced.js**

在Countly提供的初始API下做一层基本的封装(**APIBasic.js**)，先满足快速调用所需，然后再做进一步的封装来满足项目所需(**APIAdvanced.js**)。

**APIBasic.js**

```javascript
/**
 * 对Countly的基本封装，不建议直接使用
 * @module analytic/basicAPI
 */
function track (trackArgs) {
  if (window.Countly && window.Countly.q instanceof Array) {
    // 封装基本的数据记录方法Countly.q.push()
    window.Countly.q.push(trackArgs)
  } else {
    console.log('Countly 尚未就绪')
  }
}
// 封装自动化跟踪用户会话 Countly.q.push(['track_sessions'])
function trackSession () {
  track(['track_sessions'])
}
// 封装跟踪JavaScript错误 Countly.q.push(['track_errors'，options])
function trackErrors (options) {
  if (options) {
    track(['track_errors', options])
  } else {
    track(['track_errors'])
  }
}
// 封装跟踪页面浏览数 Countly.q.push(['track_pageview'，options])
function trackPageView (routePath) {
  track(['track_pageview', routePath])
}
// 封装报告处理例外的错误 Countly.q.push(['track_pageview'，options])
function logError (exception) {
  track(['log_error', exception])
}
//封装breadcrumbs,了解用户遇到错误之前的行为
function trackEvent (options) {
  // options示例，请使用我们定义的规范
  // {
  //   "key": "click",
  //   "count": 1,
  //   "sum": 1.5,
  //   "dur": 30,
  //   "segmentation": {
  //     "key1": "value1",
  //     "key2": "value2"
  //   }
  // }
  track(['add_event', options])
}
//封装breadcrumbs，其余行为
function addLog (log) {
  track(['add_log', log])
}
//封装某个事件的开始(自定义字段，与官方文档无关)
function startEvent (eventName) {
  track(['start_event', eventName])
}
//封装某个事件的结束(自定义字段，与官方文档无关)
function endEvent (eventName) {
  track(['end_event', eventName])
}
//将封装的方法导出在analyticMethods对象上。
export const analyticMethods = {
  trackSession,
  trackErrors,
  trackPageView,
  logError,
  addLog,
  trackEvent,
  startEvent,
  endEvent
}
//在Vue.prototype上挂载$analytic方法以便全局调用。
export default {
  install (Vue) {
    if (!Vue.prototype.$analytic) {
      Vue.prototype.$analytic = {}
    }

    Object.keys(analyticMethods).forEach(function (method) {
      Vue.prototype.$analytic[method] = analyticMethods[method]
    })
  }
}

```

**APIAdvanced.js**

```javascript
/**
 * 对Countly基础封装的进一步封装，建议使用这里的方法
 * @module analytic/api
 */
//导入项目封装的基本封装方法
import {
  analyticMethods
} from './APIBasic'
import event from '../constant/event'
//专门封装一个用于记录click事件的方法
function trackClick (segmentation) {
  analyticMethods.trackEvent({
    key: 'click',
    segmentation
  })
}

// 性能统计,最基础的API,并没有暴露出去
function trackPerformance (segmentation, milliSeconds) {
  // dur是以秒计的，这里不用
  // count就让默认为1
  analyticMethods.trackEvent({
    key: event.performance,
    sum: milliSeconds,
    segmentation
  })
}

// 记录navigation的性能指标
function trackNavigationPerformance (name, milliSeconds) {
  trackPerformance({
    navigation: name
  }, milliSeconds)
}

// 记录script加载的时间
function trackScriptPerformance (resourceName, milliSeconds) {
  trackPerformance({
    script: resourceName
  }, milliSeconds)
}

// 记录image加载的时间
function trackImagePerformance (resourceName, milliSeconds) {
  trackPerformance({
    image: resourceName
  }, milliSeconds)
}

// 记录style加载的时间
function trackStylePerformance (resourceName, milliSeconds) {
  trackPerformance({
    style: resourceName
  }, milliSeconds)
}

// 跟踪时间
function trackDuration (name, milliSeconds) {
  analyticMethods.trackEvent({
    key: name,
    sum: milliSeconds
  })
}

const trackMethods = {
  trackClick,
  trackDuration,
  trackNavigationPerformance,
  trackScriptPerformance,
  trackImagePerformance,
  trackStylePerformance
}

export default {
  install (Vue) {
    if (!Vue.prototype.$analytic) {
      Vue.prototype.$analytic = {}
    }

    Object.keys(trackMethods).forEach(function (method) {
      Vue.prototype.$analytic[method] = trackMethods[method]
    })
  }
}

```

---

### 性能追踪

因为window.performance中已经记录了很多性能方面的东西，无需我们做过多的事情，记录即可。

下面代码示例中根据自己项目需求引入所需要记录的性能即可。

**首屏性能**

```javascript
/**
 * 性能监控模块
 * @module
 */
import {
  performance
} from '../constant/segmentation'

/**
 * 监控navigation性能
 * @function
 */
export default function trackNavigation (analytic) {
  //  https://juejin.im/entry/58ba9cb5128fe100643da2cc
  // （使用该api时需要在页面完全加载完成之后才能使用，最简单的办法是在window.onload事件中读取各种数据，因为很多值必须在页面完全加载之后才能得出。）

  var timing = window.performance && window.performance.timing
  // var navigation = window.performance && window.performance.navigation

  // 重定向次数：
  // var redirectCount = navigation && navigation.redirectCount

  // 跳转耗时：
  // var redirect = timing.redirectEnd - timing.redirectStart

  // APP CACHE 耗时：
  // var appcache = Math.max(timing.domainLookupStart - timing.fetchStart, 0)

  // DNS 解析耗时：
  // var dnsDuration = timing.domainLookupEnd - timing.domainLookupStart
  // analytic.trackNavigationPerformance(performance.DNSDuration, dnsDuration)

  // TCP 链接耗时：
  // var conn = timing.connectEnd - timing.connectStart

  // 等待服务器响应耗时（注意是否存在cache）：
  // var request = timing.responseStart - timing.requestStart
  // analytic.trackNavigationPerformance(performance.requestDuration, request)

  // 内容加载耗时（注意是否存在cache）:
  // var response = timing.responseEnd - timing.responseStart
  // analytic.trackNavigationPerformance(performance.responseDuration, response)

  // 总体网络交互耗时，即开始跳转到服务器资源下载完成：
  var network = timing.responseEnd - timing.navigationStart
  analytic.trackNavigationPerformance(performance.networkDuration, network)

  // 渲染处理：
  var processing = (timing.domComplete || timing.domLoading) - timing.domLoading
  analytic.trackNavigationPerformance(performance.DOMRenderDuration, processing)

  // 抛出 load 事件：
  // var load = timing.loadEventEnd - timing.loadEventStart

  // 总耗时：
  // var total = (timing.loadEventEnd || timing.loadEventStart || timing.domComplete || timing.domLoading) - timing.navigationStart

  // 可交互：
  var domInteractiveDuration = timing.domInteractive - timing.navigationStart
  analytic.trackNavigationPerformance(performance.DOMInteractiveDuration, domInteractiveDuration)

  // 请求响应耗时，即 T0，注意cache：
  // var t0 = timing.responseStart - timing.navigationStart
  // analytic.trackNavigationPerformance(performance.responseStartDuration, t0)

  // 首次出现内容，即 T1：
  var domLoadDuration = timing.domLoading - timing.navigationStart
  analytic.trackNavigationPerformance(performance.DOMLoadDuration, domLoadDuration)

  // 内容加载完毕，即 T3：
  var domLoadedDuration = timing.loadEventEnd - timing.navigationStart
  analytic.trackNavigationPerformance(performance.DOMLoadedDuration, domLoadedDuration)
}

```

**各项资源的加载时间**

```javascript
/**
 * 统计各项资源的加载时间
 * @module
 */

function parseURL (url) {
  let a = document.createElement('a')
  a.href = url
  return a
}

function getEntries (filter) {
  if (filter && typeof filter === 'function') {
    if (window.performance && window.performance.getEntries) {
      // chrome里面传参是没有用的
      let entries = window.performance.getEntries()
      return entries && entries.filter(filter)
    }
  }
}

function getFileNameRegExpWithoutSuffix (fileSuffix) {
  return new RegExp(`/([^/.]+)(\\.[^/]+)*\\.${fileSuffix}$`, 'ig')
}

function getResourceName (entryName, regexp) {
  let url = parseURL(entryName)
  let result = regexp.exec(url.pathname)
  return (result && result[1]) || url.pathname
}

function trackResource (filter, currentCount, trackerFun) {
  let resources = getEntries(filter)
  if (resources && resources.length > 0) {
    for (let i = currentCount; i < resources.length; i++) {
      let entry = resources[i]

      if (entry.duration > 0) {
        // 取出js的文件名
        trackerFun(entry)
      }
    }

    return resources.length
  }
}

// 统计script
var scriptCount = 0

function trackScript (analytic) {
  let newScriptCount = trackResource(
    entry => {
      return entry.entryType === 'resource' && entry.initiatorType === 'script'
    },
    scriptCount,
    entry => {
      let regexp = getFileNameRegExpWithoutSuffix('js')
      let name = getResourceName(entry.name.replace('vendors~', ''), regexp)
      analytic.trackScriptPerformance(name, entry.duration)
    })

  if (newScriptCount > 0) {
    scriptCount = newScriptCount
  }
}
// 统计图片
var imageCount = 0

function trackImage (analytic) {
  let newImageCount = trackResource(
    entry => {
      return entry.entryType === 'resource' &&
        (entry.initiatorType === 'img' || entry.initiatorType === 'css')
    },
    imageCount,
    entry => {
      let name = getResourceName(entry.name, /\/([^/]+\.\w+)$/ig)
      analytic.trackImagePerformance(name, entry.duration)
    })

  if (newImageCount > 0) {
    imageCount = newImageCount
  }
}

// 统计css
var styleCount = 0

function trackStyle (analytic) {
  let newStyleCount = trackResource(
    entry => {
      return entry.entryType === 'resource' && entry.initiatorType === 'link'
    },
    styleCount,
    entry => {
      let name = getResourceName(entry.name, getFileNameRegExpWithoutSuffix('css'))
      analytic.trackStylePerformance(name, entry.duration)
    }
  )

  if (newStyleCount > 0) {
    styleCount = newStyleCount
  }
}

export default function (analytic) {
  trackImage(analytic)
  trackScript(analytic)
  trackStyle(analytic)
}

```

### 初始化

**InitAnalytic.js**

应用的项目为native app，所以需要这么一个初始化，如有疑惑可以先看上面`封装`

因为文档中异步调用建议在文档的head插入初始化代码，所以需要和模块的bundle独立开来。

```javascript
console.log('Countly init')
var Countly = window.Countly = window.Countly || {}
Countly.q = Countly.q || []

// provide your app key that you retrieved from Countly dashboard
Countly.app_key = 'c96cd546abe72c9837d93e28c259cc2d7e73728c'

// provide your server IP or name. Use try.count.ly for EE trial server.
// if you use your own server, make sure you have https enabled if you use
// https below.
Countly.url = 'https://demo.finsquirrel.com:9443';

// load countly script asynchronously
(function () {
  var cly = document.createElement('script')
  cly.type = 'text/javascript'
  cly.async = true
  // enter url of script here
  cly.src = '//cdn.jsdelivr.net/countly-sdk-web/latest/countly.min.js'

  console.log('Request Countly')
  cly.onload = function () {
    Countly.init()
    console.log('Countly initialized')
  }
  var s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(cly, s)
})()

```

因为生产环境下window的load事件处理函数是不会触发，性能/错误最终需要在加载完成后执行，如有疑惑可以先看上面`封装`

```javascript
import trackPerformance from './performance'

export default {
  install (Vue, options) {
    const analytic = Vue.prototype.$analytic

    // 生产环境下window的load事件处理函数是不会触发的,所以出此下策
    var initTimeId = setInterval(function () {
      // 因为要统计加载时间，所以放到加载完成后执行
      if (window.performance.timing.loadEventEnd > 0) {
        console.log('track start')
        analytic.trackSession()
        analytic.trackErrors()
        trackPerformance(analytic)
        clearInterval(initTimeId)
      }
    }, 1000)

    // 跟踪错误
    Vue.config.errorHandler = function (err, vm, info) {
      console.log('错误已跟踪')
      console.error(err, vm, info)
      err.message = `原始message:${err.message}\n
        路由信息:${window.location.href}\n
        DOM innerHTML:${vm.$el && vm.$el.innerHTML}\n
        info:${info}`
      analytic.logError(err)
    }
  }
}

```

