## IOS12 WKWebview Keyboard对HTML文档的影响及解决

### 前言:

> IOS12正式版发布，公司的人都急不可待的更新上了，原本我们开发也都觉得没什么嘛，总不可能越更新越开历史的倒车吧，肯定是越更新支持的新特性越多啦。。。啦
>
> 今天早上传来噩耗，需要填写表单的时候，键盘把文档抬升上去了，键盘消失的时候竟然没有把文档的抬升给恢复！
>
> 我们知道在IOS11和10，WKWebview的行为都是键盘出现抬升文档，键盘消失文档位置恢复。
>
> 你说我这个小心肝啊，本来我一直都是严肃体的博主，今天必须对苹果说一句：你忙吧，我吃柠檬！
>
> 不过奇怪的是，在Safari中，所有的键盘抬升和消失对文档的行为都是正常的。
>
> 其实这个问题也不是我们前端来解决的，不过IOS的同学现在都在一脸懵逼中，我们先把这个窟窿临时修补一下吧。

### 解决：

首先还是废话一下，讲下自己的对苹果keyboard抬升文档实现原理的见解：

**在keyboard升起的时候，Webview的高度提高一个Keyboard的高度，然后在原生的层面上去获取表单元素的位置，计算出文档的高度，如果在设定的水平线上，那么就不做抬升操作，如果在水平线下，那就做抬升操作，抬升的高度和表单元素距离顶部的高度有关。**

文档抬升下去了下不来，我在MDN上搜了一下Scroll相关的函数，找到了一个不错的解决方法：

```javascript
window.scrollTo(x-coord,y-coord )

window.scrollTo(options)
// 设置滚动行为改为平滑的滚动
window.scrollTo({ 
    top: 1000, 
    behavior: "smooth" 
});
```

详情请看：(window.scrollTo())[https://developer.mozilla.org/zh-CN/docs/Web/API/Window/scrollTo]

OK，全剧终，就是那么简单。

> Tips：KeyBoard那个完成按钮事件我们前端是无法捕获的，Safari不存在这个问题无需关注，而如果是以Web页面为主的HybridApp，建议跟原生沟通，让原生监测到这个完成按钮点击事件然后调用你设定好的函数，内执行window.scrollTo方法。