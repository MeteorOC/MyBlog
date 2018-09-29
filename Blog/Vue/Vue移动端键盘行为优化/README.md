## 两端差异-键盘行为优化

> 2018/9/12，惯例打开 Jira，看到一排排鲜红的 bug 列表，迷迷糊糊的我突然就吓醒了，点开查看，清一色的`软键盘遮挡表单`问题。在主流程通过测试后一些用户交互方面的东西被测试关注，于是这个问题彻底爆发。
>
> 请注意，项目技术选型为`Vue`

说起这个键盘差异，其实项目初期我就关注到了，但是当时主业务流程要紧而且产品跟 UI 并没有定义规范的交互流程，也就是说暂时是一个不 care 的点，就这么忽略过去了。但是现在项目末期到关注用户交互体验的时候，这个问题就变成了一道催命符，急待解决。

出现这种问题主要还是因为金融项目中有些 input 框需要调起自定义的安全键盘，需要 hack 安全键盘和普通 input 输入键盘之间的兼容问题，而在 Vue 中，V-for 的使用又是比较必要的，抬起键盘这个行为加上指令一次加在所有 input 上，那么这个事情做起来就更需要注意会不会导致出现奇怪的 bug。

### Android 端：

浏览器键盘像是一层`position:absoulte`的 div 覆盖在浏览器上面，当`表单类`元素获得焦点的时候弹出，`表单类`元素失去焦点的时候消失(用户也可以手动点击输入法一个向下的箭头让其消失)，点击空白区域也可让键盘自行消失，此时`表单类`元素也失去焦点。

### IOS 端：

浏览器键盘也是像`position:absoulte`的 div 覆盖在浏览器上面，但此时 Webview 会扩大一个浏览器键盘的高度，页面出现滚动条，在原生的层面上去获取当前点击的位置，计算出文档的高度，如果在设定的水平线上，那么就不做抬升操作，如果在水平线下，那就做抬升操作，抬升的高度和表单元素距离顶部的高度有关。

当`表单类`元素获得焦点时显示，`表单类`元素失去焦点的时候消失，**点击空白区域时`表单类`元素不会失去焦点。**

如果原生需要做第三方键盘来代替浏览器键盘，那么你将会注意到：
①input focus 时如果同时调用第三方键盘，那么 IOS 原生无非就是拦截掉调出浏览器键盘事件然后给你上个自定义键盘。如果这么做的话，input 会得到焦点后马上失焦。所以最好不要用 focus 做什么事情。
② 根据 ①，我们在做这种自定义键盘调用的时候一般也是用`touch`或者`click`并且让 input 为`readonly`状态。此时因为 input 不会再获得焦点，IOS 端是不会帮你抬屏的，问题就是这里其实也隐藏了一个很大的坑：如果你自己通过样式的行为去做一个抬屏的的操作，单个输入框看上去一点问题都没有。但是输入框之间切换的话，IOS 自己的抬屏就会变得不正常。
③ 如果要在 IOS 做混合 APP 自定义键盘的兼容没有原生的协助，那么我建议前端们先把电脑扔出窗外先冷静冷静。

### 总结：

IOS 普通 input 唤出的键盘无需做过多兼容，本身已经有了很好的支持，只需要将点击空白区域时`表单类`元素失去焦点这个功能添加上即可。
IOS 端第三方键盘的抬屏处理建议让原生一起做了。苹果帮助普通用户获得更好的体验的时候，丝毫没有想到这对开发者会有什么影响：开发者想做一些定制行为的时候，总会遇到奇怪的问题。

Android 普通 input 调用则需要对 input 添加一个指令，该指令主要负责计算 input 位于页面的位置然后传回参数来确定是否抬屏，以达到类似 IOS 端的效果。

同时 Android 输入法内置的收起箭头无法触发 input 框的失焦事件，这个需要从原生层面上去解决，非 Web 端力所能及，无需过多纠结，对于自定义键盘的处理，Android 的原生同学可以选择做或者不做，不做嘛前端也能做，做嘛前端就省点力气。

### 用于键盘生效时抬升键盘的全局指令：

```javascript
/**
 * v-input-positioning指定，用于解决软键盘遮挡input的问题，现在只在android中触发
 * 绑定该指令的组件，当其中的input取得焦点时会触发input-positioning事件，该事件将该元素应该上移的样式抛出来
 * 用户需要自行决定需要将该样式绑定到哪里
 * 失去焦点会抛出空字符串
 */
Vue.directive('input-positioning', {
  bind(el, binding, vnode, oldVnode) {
    // 触发调整input位置的条件，现在只有安卓才触发
    function getVueInstance(vnode) {
      return vnode.componentInstance || vnode.context
    }
    // 取得input元素
    function getInputElement(el) {
      return el.tagName === 'INPUT' ? el : el.querySelector('input')
    }

    // 冒泡事件
    function executeHandler(binding, vnode, style, position) {
      let handler = vnode.context[binding.expression]
      if (handler) {
        handler(style, position)
      } else {
        binding.value.call(vnode.context, style, position)
      }
    }
    // 首次focus时取得元素的位置并记录
    function getInitPositionOfElement(el, vnode) {
      if (!el.dataset.position) {
        let componentElement = vnode.componentInstance ? vnode.componentInstance.$el : el
        // 计算应该上移的高度,并保存数据，需要保证已经插入到文档中
        if (componentElement.offsetTop && componentElement.offsetHeight) {
          el.dataset.position = componentElement.offsetTop + componentElement.offsetHeight
        }
      }
    }
    // 有绑定表达式，但是却没有值的时候，就说明不需要触发事件
    if (binding.expression && binding.value && typeof binding.value !== 'function') {
      throw new Error(
        'v-input-positioning绑定表达式必须为一个函数以激活input自适应位置功能，' + '或其值能转化为false从而禁用该功能'
      )
    } else if (!binding.expression || !binding.value) {
      return
    }
    let shouldTrigger = getVueInstance(vnode).$global.userAgent.IS_ANDROID
    if (shouldTrigger) {
      let input = getInputElement(el)

      // 给input添加事件，非password type的input框使用以下处理：
      // 不需要对password type的input框单独处理的话去掉对type的判断即可。
      if (input && input.type !== 'password') {
        // 记录未适配时的位置
        input.addEventListener('focus', function(event) {
          getInitPositionOfElement(el, vnode)
          let top = el.dataset.position - window.innerHeight * 0.4
          let style = top > 0 ? `transform:translateY(-${top}px)` : ''
          executeHandler(binding, vnode, style, el.dataset.position)
        })
        input.addEventListener('blur', function(event) {
          executeHandler(binding, vnode, '', el.dataset.position)
        })
        input.addEventListener('keypress', function(event) {
          if (event.key === 'Enter') {
            this.blur()
          }
        })
      }
    }
  }
})
```

### IOS 端点击空白区域 input 失焦函数

```javascript
document.getElementById('app').ontouchend = () => {
  //this.$global.userAgent.IS_IOS是我项目中定义的判断设备端的字段，请根据项目情况自行设置
  if (this.$global.userAgent.IS_IOS) {
    //CHILDRENROUTER是我项目中定义的router-view的统一ID，遍历其中的input并使它们全部失焦。
    if (document.getElementById('CHILDRENROUTER').querySelector('input')) {
      document
        .getElementById('CHILDRENROUTER')
        .querySelectorAll('input')
        .blur()
    }
  }
}
```

### 对安全键盘行为的全局指令：

> 首先说明一下 Android/IOS 端呼出自定义(安全)键盘时两端的差异。
>
> - Android：Android 端在浏览器存在自定义键盘时不会帮开发者处理 input 的聚焦与失焦，也就是说如果在 input 框聚焦的同时含有自定义键盘，那么此时界面上将存在两个键盘，而因我项目的原生处理事情效率不高，所以还是决定自己来做这个兼容，这个时候就要在 input 框得到焦点时让其失焦，需要抬屏再根据前面的指令来做兼容。
> - IOS：IOS 端在浏览器存在自定义键盘时会自行将 input 失焦，也就是说自定义键盘或者浏览器键盘只能同时存在一个。抬屏问题无需兼容，智能抬屏依然生效。
> - 共同的问题：本质上都是 input 失焦才能呼出这个自定义键盘，所以光标无法生效。但个人不建议用其它元素的边框动画来做一个假的光标处理，除非封装成组件。

```javascript
Vue.directive('password-keyboard', {
  bind(el, binding, vnode) {
    function getVueInstance(vnode) {
      return vnode.componentInstance || vnode.context
    }
    // 取得input元素
    function getInputElement(el) {
      if (el.tagName === 'INPUT') {
        return el
      } else {
        throw new Error('password-keyboard指令只能绑定在input元素上,当type="password"时生效')
      }
    }
    // 首次focus时取得元素的位置并记录
    function getInitPositionOfElement(el, vnode) {
      if (!el.dataset.position) {
        let componentElement = vnode.componentInstance ? vnode.componentInstance.$el : el
        // 计算应该上移的高度,并保存数据，需要保证已经插入到文档中
        let rect = componentElement.getBoundingClientRect()
        el.dataset.position = rect.top + rect.height
      }
    }
    // 冒泡事件
    function executeHandler(binding, vnode) {
      let handler = vnode.context[binding.expression]
      //安全键盘状态(升起true/隐藏false，默认为false)
      let keyBoardState = false
      //安全键盘输入的内容对象，无值时为空
      let keyBoardInputObject = {}
      //只有安卓需要抬屏上的处理
      let styleObject = getVueInstance(vnode).$global.userAgent.IS_ANDROID
        ? {
            top: Math.floor(el.dataset.position - window.screen.availHeight * 0.45)
          }
        : {}
      if (typeof styleObject.top !== 'undefined') {
        styleObject.style = styleObject.top > 0 ? `transform:translateY(-${styleObject.top}px)` : ''
      }
      if (handler) {
        //安全键盘升起时的回调
        getVueInstance(vnode).$native.registerKeyBoardUp(() => {
          keyBoardState = true
          handler(keyBoardState, keyBoardInputObject, styleObject)
        })
        //安全键盘隐藏时的回调
        getVueInstance(vnode).$native.registerKeyBoardDown(() => {
          keyBoardState = false
          handler(keyBoardState, keyBoardInputObject, styleObject)
        })
        //安全键盘输入时的回调
        getVueInstance(vnode).$native.registerKeyInputs(e => {
          keyBoardInputObject = {
            unrealPsw: new Array(parseInt(e.keylength) + 1).join('●'),
            encryptionPsw: e.pswRSA,
            realPsw: e.password
          }
          handler(keyBoardState, keyBoardInputObject, styleObject)
        })
      } else {
        binding.value.call(vnode.context, keyBoardState, keyBoardInputObject)
      }
    }
    let input = getInputElement(el)
    //$global.userAgent.IS_FINCHAT字段判断是否在我们的原生环境内，如果在纯页端是无法访问到原生的方法的，这个时候就不需要做其他的事情了，input直接正常使用即可。
    if (input && input.type === 'password' && getVueInstance(vnode).$global.userAgent.IS_FINCHAT) {
      //在自家的原生环境下，聚焦后判断是否为Android端，如果是Android端聚焦后马上失焦
      //如果是IOS端则可以在不做失焦(实际上WKwebview已经帮你做了)的情况下直接调用安全键盘
      input.addEventListener('focus', function(event) {
        getInitPositionOfElement(el, vnode)
        if (getVueInstance(vnode).$global.userAgent.IS_ANDROID) {
          document.activeElement.blur()
        }
        //调用自定义(安全)键盘函数
        getVueInstance(vnode)
          .$native.openLoginKeyboard(() => {})
          .then(data => {})
          .catch(error => {
            console.log(error)
          })
        //聚焦时冒泡事件
        executeHandler(binding, vnode)
      })
    }
  }
})
```

### 感想：

其实有些东西，本来是应该两端开发人员帮页端做好的/想好的东西，让纯 Web 端做兼容，是一件很不厚道的事情。。

因为 Web 端做这类兼容容易留下大量 hack 过的代码，以后别人想迭代和升级都脑壳疼，而且也不完美。

现在使用 input 元素，简单的 HTML 代码：

```html
<div style="transition: all .3s ease"
         :style="style">
<input type="password"
    v-input-positioning="test"
    v-model="pd"
    v-password-keyboard="keyboard" />
</div>
```

然后自己在页面内根据不同的需求定义一下指令绑定的函数

```javascript
test (e) {
      this.style = e
},
keyboard (keyBoardState, keyBoardInputObject, styleObject) {
        this.pd = typeof (keyBoardInputObject.unrealPsw) !== 'undefined' ? keyBoardInputObject.unrealPsw : ''
      if (typeof (styleObject.style) !== 'undefined') {
        this.style = keyBoardState ? styleObject.style : ''
      }
}
```

其实 test 和 keyboard 是可以整个到一起的，两个指令公用一个函数。

彻底一点来做，抬屏这件事情可以让指令把传回的 style 直接附加给公共容器 div 元素的 style，这样就不用在每个 vue 文件内都对自己的 container 做传 style 处理了。

后续可以直接对这种 input 封装成组件，test 函数和 keyboard 函数回传的东西统一通过$emit 到相同的事件上给父组件，这样就更好，同时还可以定制它们在项目中的行为。
