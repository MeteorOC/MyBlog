## Vue代码复用-Mixin用法简述

> 按照个人的理解，Mixin（混入），常用于提高代码复用和方便访问一些全局变量的一个功能。
>
> Mixin对象内可以包含任何组件选项，当组件使用Mixin对象时，如果组件中有选项的属性与Mixin选项的属性冲突，那么组件中选项的属性优先。

### 组件级Mixin

**例子**（引用官方）：

```javascript
// 定义一个混入对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"
```

那么在一个常规项目中，无非就是定义创建Mixin文件夹，根据不同的组件Mixin功能定义不同名字的Mixin，然后将其导出，在组件/路由中引入。

**实际项目例子**：

*./mixins/maskMixin*

```javascript
export default {
  computed: {
    $_maskMixin_HelloWorld () {
      return 'helloWorld'
    }
  }
}
```

*./container/myVueProject*

```javascript
<script>
import maskMixin from './mixins/maskMixin'
mixins: [maskMixin],
mounted () {
    console.log(this.$_maskMixin_HelloWorld) //helloWorld
}
</script>
```

### 全局Mixin

如果要在所有组件内引入某个特定的Mixin，那会是一件重复度很高的事情，所以就有了全局Mixin

**官方例子：**

```javascript
// 为自定义的选项 'myOption' 注入一个处理器。
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// => "hello!"
```

**实际项目例子：**

*./Vuex/Common.js*

```javascript
/**
 * 模块共享的公共状态
 * @module modules/aboutUs
 */
const state = {
  version: '1.0.0'
}
/**
 * '关于我们'模块getters状态
 * @constant getters
 * @property {string} version -版本号
 */
const getters = {
  // 版本号
  version: state => state.version,
}

const actions = {

}

const mutations = {}
export default {
  state,
  actions,
  mutations,
  getters
}
```

*./Vuex/index.js*

```javascript
import common from './common'
export default {
  common
}
```

*./mixins/Common.js*

```javascript
import {
  mapGetters
} from 'vuex'

export default function (Vue) {
  Vue.mixin({
    computed: {
      ...mapGetters([
        'version'
      ])
    }
  })
}
```

*./main.js*

```javascript
import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import modules from './Vuex'
import CommonMixin from './Mixin/Common'
Vue.config.productionTip = false
Vue.use(Vuex)
const store = new Vuex.Store({
  modules,
  strict: false
})
CommonMixin(Vue)
new Vue({
  render: h => h(App),
  store
}).$mount('#app')
```

*./某个不知名Vue文件*

```javascript
mounted () {
    console.log(this.version) //'1.0.0'
}
```

### 自定义选项合并策略

不做详细介绍，需要用到的时候再去看吧。

简单的说就是：如果自己封的Mixin只有部分不符合自己组件的要求，那么可以通过这个来覆盖传进来的选项。

详阅：[自定义选项合并策略](https://cn.vuejs.org/v2/guide/mixins.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%80%89%E9%A1%B9%E5%90%88%E5%B9%B6%E7%AD%96%E7%95%A5)