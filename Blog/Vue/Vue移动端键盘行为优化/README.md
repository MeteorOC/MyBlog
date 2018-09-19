## 两端差异-键盘行为优化

> 2018/9/12，惯例打开Jira，看到一排排鲜红的bug列表，迷迷糊糊的我突然就吓醒了，点开查看，清一色的`软键盘遮挡表单`问题。在主流程通过测试后一些用户交互方面的东西被测试关注，于是这个问题彻底爆发。
>
> 请注意，项目技术选型为`Vue`

说起这个键盘差异，其实项目初期我就关注到了，但是当时主业务流程要紧而且产品跟UI并没有定义规范的交互流程，也就是说暂时是一个不care的点，就这么忽略过去了。但是现在项目末期到关注用户交互体验的时候，这个问题就变成了一道催命符，急待解决。

出现这种问题主要还是因为金融项目中有些input框需要调起自定义的安全键盘，需要hack安全键盘和普通input输入键盘之间的兼容问题，而在Vue中，V-for的使用又是比较必要的，抬起键盘这个行为加上指令一次加在所有input上，那么这个事情做起来就更需要注意会不会导致出现奇怪的bug。

### Android端：

浏览器键盘像是一层`position:absoulte`的div覆盖在浏览器上面，当`表单类`元素获得焦点的时候弹出，`表单类`元素失去焦点的时候消失(用户也可以手动点击输入法一个向下的箭头让其消失)，点击空白区域也可让键盘自行消失，此时`表单类`元素也失去焦点。

@focus事件会与@click事件有冲突。

### IOS端：

浏览器键盘会将Webview页面推上去，此时Webview页面缩小，页面出现滚动条，无需做过多兼容，因为浏览器键盘将Webview推上去的时候，苹果对Webview做了定制可以让表单元素在正确的地方显示，不会被键盘覆盖。

当`表单类`元素获得焦点时弹出，`表单类`元素失去焦点的时候消失，点击空白区域时`表单类`元素不会失去焦点(这个行为较为奇怪)。

@focus事件会与@click事件有冲突。

### 总结：

IOS端无需做过多兼容，本身已经有了很好的支持，只需要将点击空白区域时`表单类`元素失去焦点这个功能添加上即可。

安卓端则需要对input添加一个指令，该指令主要负责计算input位于页面的位置然后传回参数来确定是否抬屏，以达到类似IOS端的效果。

同时安卓输入法内置的收起箭头无法触发input框的失焦事件，这个需要从原生层面上去解决，非Web端力所能及，无需过多纠结。

因为@focus事件会与@click事件有冲突，在兼容安全键盘和浏览器键盘的时候务必注意不能同时使用这两个事件，除非原生层面上已经帮你处理好这个问题，比如说原生帮你处理好了当input聚焦的时候是否调用浏览器键盘的问题。

更多的需求：比如说我输入账号的时候不希望密码输入框被挡住这类的需求，如果在UI坚持不变的情况下，可以让UI和产品PK，如果大家都觉得是你的问题的话，我想你可以有一些比较大胆的想法，比如真人快打。

### 用于键盘生效时抬升键盘的全局指令：

```javascript
/**
* v-input-positioning指定，用于解决软键盘遮挡input的问题，现在只在android中触发
* 绑定该指令的组件，当其中的input取得焦点时会触发input-positioning事件，该事件将该元素应该上移的样式抛出来
* 用户需要自行决定需要将该样式绑定到哪里
* 失去焦点会抛出空字符串
*/
Vue.directive('input-positioning', {
    bind (el, binding, vnode, oldVnode) {
        // 触发调整input位置的条件，现在只有安卓才触发
        function getVueInstance (vnode) {
            return vnode.componentInstance || vnode.context
        }
        // 取得input元素
        function getInputElement (el) {
            return el.tagName === 'INPUT' ? el : el.querySelector('input')
        }

        // 冒泡事件
        function executeHandler (binding, vnode, style, position) {
            let handler = vnode.context[binding.expression]
            if (handler) {
                handler(style, position)
            } else {
                binding.value.call(vnode.context, style, position)
            }
        }
        // 首次focus时取得元素的位置并记录
        function getInitPositionOfElement (el, vnode) {
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
            throw new Error('v-input-positioning绑定表达式必须为一个函数以激活input自适应位置功能，' +
                            '或其值能转化为false从而禁用该功能')
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
                input.addEventListener('focus', function (event) {
                    getInitPositionOfElement(el, vnode)
                    let top = el.dataset.position - window.innerHeight * 0.40
                    let style = top > 0 ? `transform:translateY(-${top}px)` : ''
                    executeHandler(binding, vnode, style, el.dataset.position)
                })
                input.addEventListener('blur', function (event) {
                    executeHandler(binding, vnode, '', el.dataset.position)
                })
                input.addEventListener('keypress', function (event) {
                    if (event.key === 'Enter') {
                        this.blur()
                    }
                })
            }
        }
    }
})
```

### IOS端点击空白区域input失焦函数

```javascript
document.getElementById('app').ontouchend = () => {
    //this.$global.userAgent.IS_IOS是我项目中定义的判断设备端的字段，请根据项目情况自行设置
    if (this.$global.userAgent.IS_IOS) {
        //CHILDRENROUTER是我项目中定义的router-view的统一ID，遍历其中的input并使它们全部失焦。
        if (document.getElementById('CHILDRENROUTER').querySelector('input')) {
            document.getElementById('CHILDRENROUTER').querySelectorAll('input').blur()
        }
    }
}
```

### 对安全键盘行为的全局指令：

> 首先说明一下Android/IOS端呼出自定义(安全)键盘时两端的差异。
>
> * Android：Android端在浏览器存在自定义键盘时不会帮开发者处理input的聚焦与失焦，也就是说如果在input框聚焦的同时含有自定义键盘，那么此时界面上将存在两个键盘，而因我项目的原生处理事情效率不高，所以还是决定自己来做这个兼容，这个时候就要在input框得到焦点时让其失焦，需要抬屏再根据前面的指令来做兼容。
> * IOS：IOS端在浏览器存在自定义键盘时会自行将input失焦，也就是说自定义键盘或者浏览器键盘只能同时存在一个。抬屏问题无需兼容，智能抬屏依然生效。
> * 共同的问题：本质上都是input失焦才能呼出这个自定义键盘，所以光标无法生效。但个人不建议用其它元素的边框动画来做一个假的光标处理，除非封装成组件。

```javascript
Vue.directive('password-keyboard', {
    bind (el, binding, vnode) {
        function getVueInstance (vnode) {
            return vnode.componentInstance || vnode.context
        }
        // 取得input元素
        function getInputElement (el) {
            if (el.tagName === 'INPUT') {
                return el
            } else {
                throw new Error('password-keyboard指令只能绑定在input元素上,当type="password"时生效')
            }
        }
        // 首次focus时取得元素的位置并记录
        function getInitPositionOfElement (el, vnode) {
            if (!el.dataset.position) {
                let componentElement = vnode.componentInstance ? vnode.componentInstance.$el : el
                // 计算应该上移的高度,并保存数据，需要保证已经插入到文档中
                let rect = componentElement.getBoundingClientRect()
                el.dataset.position = rect.top + rect.height
            }
        }
        // 冒泡事件
        function executeHandler (binding, vnode) {
            let handler = vnode.context[binding.expression]
            //安全键盘状态(升起true/隐藏false，默认为false)
            let keyBoardState = false
            //安全键盘输入的内容对象，无值时为空
            let keyBoardInputObject = {}
            //只有安卓需要抬屏上的处理
            let styleObject = getVueInstance(vnode).$global.userAgent.IS_ANDROID ? {
                top: Math.floor(el.dataset.position - window.screen.availHeight * 0.45)
            } : {}
            if (typeof (styleObject.top) !== 'undefined') {
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
            input.addEventListener('focus', function (event) {
                getInitPositionOfElement(el, vnode)
                if (getVueInstance(vnode).$global.userAgent.IS_ANDROID) {
                    document.activeElement.blur()
                }
                //调用自定义(安全)键盘函数
                getVueInstance(vnode).$native.openLoginKeyboard(() => {}).then(data => {}).catch(error => {
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

其实有些东西，本来是应该两端开发人员帮页端做好的/想好的东西，让纯Web端做兼容，是一件很不厚道的事情。。

因为Web端做这类兼容容易留下大量hack过的代码，以后别人想迭代和升级都脑壳疼，而且也不完美。

就说两端的自定义键盘吧，现在我们做了这种指令层面上的通用处理会导致没有光标，UI看的不舒服跑过来问我们，那我们也就只能说因为原生那边没有做配合，目前我们不打算封装组件来做这种事情，也不想做。

现在使用input元素，简单的HTML代码：

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

其实test和keyboard是可以整个到一起的，两个指令公用一个函数。

彻底一点来做，抬屏这件事情可以让指令把传回的style直接附加给公共容器div元素的style，这样就不用在每个vue文件内都对自己的container做传style处理了。