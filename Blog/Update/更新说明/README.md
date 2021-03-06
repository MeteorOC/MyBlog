## 每日更新说明

### 2018-10-21~2018-10-25

**① 单元测试具体实施及编写便于测试的代码的讨论**

**② 通用脚手架 CLI 的搭建**

**③`关于我们`模块版本号允许复制**

**④Jest API 及 NodeJS API 阅览**

**⑤ 为小贷项目部分模块加入单元测试**

### 2018-10-9~2018-10-19

**① 注册/登录页面重构，抽取 GFLInputs 组件**

**②Jest+@Vue/test-utils 单元测试**

**③Bug 修复**

**④ 通用通用 CLI 搭建-Webpack 配置，单元测试模块添加，通用 UI 框架建立**

### 2018-10-9 更新

**① 安卓浏览器键盘收回事件对接**

**② 通用 CLI 搭建-全局 Mixin、Store、Axios、Countly 追踪**

**③Axios 队列排序优化和 Bug 解决**

### 2018-10-8 更新

**① 记录三级依赖架构的优缺点汇总成文档**

**② 完成需求：当授信过期时可以查看我的资料页面**

**③ 开始通用 CLI 的汇总**

### 2018-9-30 更新

**① 全局 Mixin 引入含有所有 Vuex 的 Computed(暂未上线，仍在测试)**

**② 开始接入单元测试**

### 2018-9-29 更新

**① 文档及注释更新**

**② 部分模块开始重构(比如登录或者注册)**

### 2018-9-28 更新

**① 两端键盘差异新问题**

写下这个更新日志的时候，我的心情是复杂的，沉重的。

IOS WKWebview 给我带来了极其糟糕的开发体验

少的可怜的文档及 API，自以为聪明的做了一些事情但是又没有做好，这些都让开发者想改也没地方改。

如果没有苹果，那么混合 APP 的前景将会更好，对比 WKWebview，隔壁的 Chrome 是多么的可爱。

其实早上就已经将这种全局通用的输入框封装好了，Android 端和 IOS 端通用，我信心满满的测试，感觉良好，然而现实狠狠地打了我的脸：

> 调用自定义键盘时，WKWebview 的做法是将 input 失焦，但是很 Stupid 的是它会帮你将 Webview 抬起来。
>
> 其实这些都没关系，问题就是如果你为了兼容这一系列的行为对容器的样式做一些兼容抬屏的处理，在切换输入框的时候这个行为又失效了！
>
> 也就是说，如果是单独聚焦/click 该 input 框那么行为是一切正常的，但是用户有很大的可能性是在输入框之间做一个无间隙的切换，这个就导致了抬屏的行为不一。
>
> 目前打算是让原生帮我们直接处理好 IOS 的原生键盘，而 Android 则是前端自己完成，希望下次测试的时候不会再有什么问题吧。

**② 授信模块有效日期格式调整**

RT，使用了全局指令$global.dataStringFormat(time)，将 x/x/x 格式的时间改为 x-x-x。

### 2018-9-27 更新

**① 研究 refs/document 对象在 Vue 生命周期中无法正确被读取的问题：**

经过漫长的尝试之路，最终解决，详见：[Vue 项目中 Updated 生命周期及 nextTick 方法的应用实例](https://meteorocc.github.io/MyBlog/Blog/Vue/Vue%E9%A1%B9%E7%9B%AE%E4%B8%ADUpdated%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%8F%8AnextTick%E6%96%B9%E6%B3%95%E7%9A%84%E5%BA%94%E7%94%A8%E5%AE%9E%E4%BE%8B/)

**② 输入框组件化及指令集优化：**

已推包。

**③ 新的通用输入框组件正在搭建中（目前除了校验基本完成）**

### 2018-9-26 更新

**① 输入框组件化及指令级优化：**

针对众多的输入框对应不同的需求，我们做了个通用的输入框组件（暂未上线仍在测试，应该是今晚或者明天），然后对调用安全键盘做了一个指令级别的调用优化，相对之前每个页面冗余的逻辑，现在仅需一个指令即可让 input 输入框`type='password'`时自行调用安全键盘并冒泡事件供开发者使用。

详见：[Vue 项目中移动端键盘差异及优化](https://meteorocc.github.io/MyBlog/Blog/Vue/Vue%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%94%AE%E7%9B%98%E8%A1%8C%E4%B8%BA%E4%BC%98%E5%8C%96/)

> 同时，我们也有意外收获：
>
> 在 IOS 端中，我们发现使用指令后的 input 框在安全键盘还未消失的时候点击登录，`页面事件`是不会被`安全键盘消失事件`所阻隔的，而在未使用指令前会阻隔仅仅是因为我们与此同时改变了**容器的 class 且布局会根据 class 的变化而变化**，但是还不知道为什么会有这样的影响。
>
> 在安卓端中，`安全键盘消失事件`与`页面事件`冲突还是一个头疼的问题，无论有没有改变页面布局，`页面事件`还是会被`安全键盘消失事件`所阻隔，无法触发。
>
> 初步认定，在安卓端这是需要从 WebView 层面上去解决的东西，非页端力所能及。

**② 研究 refs/document 对象在 Vue 生命周期中无法正确被读取的问题：**

起因：[APP-869 BUG 我的消息-未超过 2 行的情况下，需隐藏“展开”功能](http://jira.finsquirrel.com/browse/APP-869)

对于这个简单的要求，我实在是非常头疼。

CSS 样式中给予了"三剑客"来完成字数超过行数后显示'...'这个需求，但是"三剑客"好虽好，不过处理的过程中并没有给予前端任何的标识(比如说是否超过了限定的行数)。

而在 Vue 中，获取 Dom 元素的 Style 属性需要在合适的时机去获取，否则会报 Undefined 或者干脆什么都拿不到，这也跟 Vue 的虚拟 Dom 有关。

目前经过探索，已知在 Updated 生命周期中，是可以获取到 Dom 的更新事件的，但是在 Updated 生命周期中只会返回一个最终的结果，比如说如果一个 Dom 元素，经过了很快速的扩大-缩小这个过程，我们是无法再 Updated 生命周期中去获取这个 Dom 元素扩大时的 height 值，只能获得最终缩小时的 height 值。针对这个情况，我用了 setTimeout 的方式去让某个状态保持一定的时间，这样就可以在 Updated 生命周期中捕获某个状态下的 height 值了，但是！这样会造成页面抖动，而且也算是一种 hack 手段，方式较为复杂。

**而且在 Updated 生命周期中，不能赋值触发 Dom 更新，否则会陷入死循环，这很好理解。**

但是如果只是单纯的用宽度去除以单个字符的宽度，这样做也不太好，因为实际上每个字体的宽度都不一样。

目前还在寻找方法解决中。

### 2018-9-25 更新

**① Axios 静默请求队列化，页面切换时重复请求不会在请求完成前再次请求。**

详阅：[Axios 静默请求队列化](https://meteorocc.github.io/MyBlog/Blog/Axios/Axios%E9%9D%99%E9%BB%98%E8%AF%B7%E6%B1%82%E9%98%9F%E5%88%97%E5%8C%96/)

**② 路由异步获取错误时跳转至网络错误路由，并统计错误至 Countly。**

**③ 全局通用状态(新消息提示、授信状态等)迁移至路由守卫中读取，业务代码不再含有这类状态的读取代码，方便后续管理。**

**④ 研究 refs/document 对象在 Vue 生命周期中无法正确被读取的问题**

**⑤ 注释及文档更新**
