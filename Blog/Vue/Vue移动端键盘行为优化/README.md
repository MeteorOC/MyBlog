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
            } else if (input && input.type === 'password') {
                //根据项目不同，这边我多做了一个判断，主要是我们是金融项目，所有的password type input都要用到安全键盘。只要input框得到焦点那么浏览器自带的键盘就会弹出，要避免这种情况就使用document.activeElement.blur()。普通项目去掉这个判断即可
                input.addEventListener('focus', function (event) {
                    document.activeElement.blur()
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

```javascript
//作者正在思考中
```

