### 插件

#### 开发插件

---

插件通常会为Vue添加全局功能，范围没有限制。

1. 添加全局方法或者属性，如[vue-custom-element](https://github.com/karol-f/vue-custom-element)

2. 添加全局资源：指令/过滤器/过渡等，如vue-touch[vue-touch](https://github.com/vuejs/vue-touch)

3. 通过全局mixin方法添加一些组件选项，如[vue-router](https://github.com/vuejs/vue-router)

4. 添加Vue实例方法，通过把它们添加到Vue.prototype上实现(install)

5. 一个库，提供自己的API，同时提供上面提到的一个或多个功能，如[vue-router](https://github.com/vuejs/vue-router)


Vue.js的插件应当有一个公开方法`install`。这个方法的第一个参数是Vue构造器，第二个参数是一个可选的选项对象：

```javascript
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

---

正常来说，这样开发组件下来，需要通过全局方法Vue.use()使用插件:
Vue.use(MyPlugin) / Vue.use(MyPlugin,options)

Vue.js官方提供的一些插件在检测到`Vue`是可以访问的全局变量时会自动调用Vue.use()，但是在CommonJS的模块环境中，应该始终显式的调用Vue.use()。

实际上，如果仅仅是在Vue.prototype上面添加实例方法让函数可以全局使用的话，仅需这样做：

```javascript
export function yourMethod(){}
export default {
  install (Vue) {
    Vue.prototype.$yourGlobalObject.yourMethod = yourMethod
  }
}
```

