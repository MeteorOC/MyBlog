## IOS12 WKWebview Keyboard对HTML文档的影响及解决

### 前言:

> 我们知道在IOS11和10，WKWebview的行为都是键盘出现抬升文档，键盘消失文档位置恢复。
>
> 而在IOS12中，奇怪的WKWebkit的KeyBoard对于智能抬升行为仅仅只做了一半，对此我只能认为是一个BUG。
>
> 不过奇怪的是，在Safari中，所有的键盘抬升和消失对文档的行为都是正常的。
>
> 其实这个问题也不是我们前端来解决的，不过IOS的同学现在都在一脸懵逼中，我们先把这个窟窿临时修补一下吧。

### 解决：

首先还是废话一下，讲下自己的对苹果keyboard抬升文档实现原理的见解：

**在keyboard升起的时候，Webview的高度提高一个Keyboard的高度，然后在原生的层面上去获取表单元素的位置，计算出文档的高度，如果在设定的水平线上，那么就不做抬升操作，如果在水平线下，那就做抬升操作，抬升的高度和表单元素距离顶部的高度有关。**

文档抬升上去了下不来，我在MDN上搜了一下Scroll相关的函数，找到了一个不错的解决方法：

```javascript
window.scrollTo(x-coord,y-coord )

window.scrollTo(options)
// 设置滚动行为改为平滑的滚动
window.scrollTo({ 
    top: 1000, 
    behavior: "smooth" 
});
```

详情请看：[window.scrollTo()](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/scrollTo)

因为我们的表单可输入内容的元素只有input，所以只是在input失焦的时候就调用`window.scrollTo(0,0)`即可

> Tips：KeyBoard那个完成按钮事件我们前端是无法捕获的，Safari不存在这个问题无需关注，而如果是以Web页面为主的HybridApp，建议跟原生沟通，让原生监测到这个完成按钮点击事件然后调用你设定好的函数，内执行window.scrollTo方法。

