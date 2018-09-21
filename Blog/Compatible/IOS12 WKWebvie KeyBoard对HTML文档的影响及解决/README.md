## IOS12 WKWebview Keyboard 对 HTML 文档的影响及解决

### 前言:

> 我们知道在 IOS11 和 10，WKWebview 的行为都是键盘出现抬升文档，键盘消失文档位置恢复。
>
> 而在 IOS12 中，WKWebview 的 KeyBoard 只做了出现抬升而不做消失恢复，对此我只能认为是一个 BUG。
>
> 不过奇怪的是，在 Safari 中，所有的键盘抬升和消失对文档的行为都是正常的。
>
> 其实这个问题也不应该由前端来解决，不过 IOS 的同学现在都在一脸懵逼中，我们先把这个窟窿临时修补一下吧。

### 解决：

首先还是废话一下，讲下自己的对苹果 keyboard 抬升文档实现原理的见解：

**在 keyboard 升起的时候，Webview 的高度提高一个 Keyboard 的高度，然后在原生的层面上去获取表单元素的位置，计算出文档的高度，如果在设定的水平线上，那么就不做抬升操作，如果在水平线下，那就做抬升操作，抬升的高度和表单元素距离顶部的高度有关。**

文档抬升上去了下不来，那么有没有办法重置文档的位置呢？
我在 MDN 上搜了一下 Scroll 相关的函数帮助文档重置/恢复原位，搜到了`window.scrollTo`：

```javascript
window.scrollTo(x - coord, y - coord)

window.scrollTo(options)
// 设置滚动行为改为平滑的滚动
window.scrollTo({
  top: 1000,
  behavior: 'smooth'
})
```

详情请看：[window.scrollTo](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/scrollTo)

因为我们的表单可输入内容的元素只有 input，所以只是在 input 失焦的时候就调用`window.scrollTo(0,0)`即可。

至于 WKWebview 到底出了什么问题，我暂时没时间去研究，这边就标记一个 TODO 吧：）

> Tips：KeyBoard 那个完成按钮事件我们前端是无法捕获的，Safari 不存在这个问题无需关注，而如果是以 Web 页面为主的 HybridApp，建议跟原生沟通，让原生监测到这个完成按钮点击事件然后调用你设定好的函数，内执行 window.scrollTo 方法。
