(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{154:function(t,s,n){"use strict";n.r(s);var a=n(0),e=Object(a.a)({},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"content"},[t._m(0),t._m(1),t._m(2),n("p",[t._v("但是，本篇博文中想着重介绍一下 Updated 生命周期和 nextTick 方法，因为这两个方法解决了我一个头疼的问题。")]),t._m(3),n("p",[t._v("实际上如果仅仅是"),n("code",[t._v("收缩的时候只显示N行的字，多余的字用''...''代替，展开的时候该列表自适应高度展示所有的文字。")]),t._v("这个功能反倒是好解决的，参考："),n("a",{attrs:{href:"http://www.css88.com/webkit/-webkit-line-clamp/",target:"_blank",rel:"noopener noreferrer"}},[t._v("多行文本的情况下，用省略号“...”隐藏超出范围的文本"),n("OutboundLink")],1)]),t._m(4),n("p",[t._v("在前端历史长河中，一般都是使用：")]),t._m(5),n("p",[t._v("这种方法来解决，而考虑更周到一些，那就还要判断行高和平均字宽，等等。")]),n("p",[t._v("如果想做的较为完美，那就要引入几个第三方解决库，而我是不太乐意的。")]),t._m(6),t._m(7),t._m(8),t._m(9),t._m(10),t._m(11),n("p",[t._v("详阅:"),n("a",{attrs:{href:"https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97",target:"_blank",rel:"noopener noreferrer"}},[t._v("异步更新队列"),n("OutboundLink")],1)]),t._m(12),n("ul",[t._m(13),n("li",[n("p",[t._v("详细:")]),n("p",[t._v("由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。")]),n("p",[t._v("当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用"),n("a",{attrs:{href:"https://cn.vuejs.org/v2/api/#computed",target:"_blank",rel:"noopener noreferrer"}},[t._v("计算属性"),n("OutboundLink")],1),t._v("或 "),n("a",{attrs:{href:"https://cn.vuejs.org/v2/api/#watch",target:"_blank",rel:"noopener noreferrer"}},[t._v("watcher"),n("OutboundLink")],1),t._v(" 取而代之。")]),n("p",[t._v("注意 "),n("code",[t._v("updated")]),n("strong",[t._v("不会")]),t._v("承诺所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕，可以用 "),n("a",{attrs:{href:"https://cn.vuejs.org/v2/api/#vm-nextTick",target:"_blank",rel:"noopener noreferrer"}},[t._v("vm.$nextTick"),n("OutboundLink")],1),t._v(" 替换掉 "),n("code",[t._v("updated")]),t._v("：")])])]),t._m(14),t._m(15),n("p",[t._v("详阅："),n("a",{attrs:{href:"https://cn.vuejs.org/v2/api/#updated",target:"_blank",rel:"noopener noreferrer"}},[t._v("Updated 钩子"),n("OutboundLink")],1)]),t._m(16),t._m(17),n("ul",[t._m(18),t._m(19),t._m(20),n("li",[n("p",[n("strong",[t._v("参考")]),t._v("："),n("a",{attrs:{href:"https://cn.vuejs.org/v2/api/#Vue-nextTick",target:"_blank",rel:"noopener noreferrer"}},[t._v("Vue.nextTick"),n("OutboundLink")],1)])])]),t._m(21),t._m(22),t._m(23),n("p",[t._v("截取一些业务上面的代码来说明这次实践：")]),t._m(24),t._m(25),n("p",[t._v("熟悉生命周期及一些 API 对我们开发大有裨益，推荐各位看一个框架之前先对官方文档通读一次。")]),t._m(26)])},[function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"vue-项目中-updated-生命周期及-nexttick-方法的应用实例"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#vue-项目中-updated-生命周期及-nexttick-方法的应用实例","aria-hidden":"true"}},[this._v("#")]),this._v(" Vue 项目中 Updated 生命周期及 nextTick 方法的应用实例")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"前言"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#前言","aria-hidden":"true"}},[this._v("#")]),this._v(" 前言")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("可能很多同学在撸 Vue 业务的时候基本没有用到 Updated 生命周期和 nextTick 方法吧，毕竟绝大部分业务下来，常用的生命周期"),s("code",[this._v("mounted")]),this._v("、"),s("code",[this._v("created")]),this._v("、"),s("code",[this._v("beforeCreated")]),this._v("已经足够使用了。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("在许多项目中应该都有一个消息页面，这个消息页面通过 Ajax 请求获取后端的数据列表，当字数超过 N(我项中"),s("code",[this._v("N=2")]),this._v(")行的时候提供展开/收缩功能，收缩的时候只显示 N 行的字，多余的字用''...''代替，展开的时候该列表自适应高度展示所有的文字。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("但是，"),s("code",[this._v("当字数超过N行时提供展开/收缩功能")]),this._v('这个问题就不太好解决了，因为我们已经使用了 CSS 来解决问题，对于它是否超过 N 行这种行为，我们是不知道的。而在 Dom 元素中，我们可以看到在没有超过 N 行的时候，虽然展示有显示"..."，但是实际获取其值的时候还是所有的文字值，没有"…"供我们判断。')])},function(){var t=this.$createElement,s=this._self._c||t;return s("blockquote",[s("p",[this._v("文字父元素宽度/font-size=可容纳字符数；")]),s("p",[this._v("通过这种方式可轻量实现(不考虑不同字符宽度不同)")])])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("blockquote",[n("p",[t._v("注意："),n("code",[t._v("-webkit-box-orient")]),t._v("在被 webpack 编译的时候会被忽略掉，原因是"),n("code",[t._v("optimize-css-assets-webpack-plugin")]),t._v("这个插件的问题，它认为"),n("code",[t._v("-webkit-box-orient")]),t._v("是一个不标准的属性，不应该被应用到项目中，但是实际上较新的 webkit 浏览器都是支持的，这里可以使用下方代码块的代码来解决这个问题。")]),n("div",{staticClass:"language-scss extra-class"},[n("pre",{pre:!0,attrs:{class:"language-scss"}},[n("code",[n("span",{attrs:{class:"token comment"}},[t._v("/*! autoprefixer: off */")]),t._v("\n"),n("span",{attrs:{class:"token property"}},[t._v("-webkit-box-orient")]),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" vertical"),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{attrs:{class:"token comment"}},[t._v("/* autoprefixer: on */")]),t._v("\n")])])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"想法"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#想法","aria-hidden":"true"}},[this._v("#")]),this._v(" 想法")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("默认给所有的列表项都加上"),s("code",[this._v("展开/收缩功能")]),this._v("，先展开列表项记录它们展开时高度，再收缩列表项记录它们收缩时高度，对比两者高度，相同的则是不需要"),s("code",[this._v("展开/收缩功能")]),this._v("的项，而不同的则是需要"),s("code",[this._v("展开/收缩功能")]),this._v("的项。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("理想很丰满现实很骨感，通过些许实践我碰到了阻碍，因为这些数据项都是通过 V-for 循环创建的，而"),s("code",[this._v("在什么时候获取Dom元素的高度值这个时机")]),this._v("便是一个问题，另一个问题则是如果通过代码级别的来控制其"),s("code",[this._v("展开/收缩")]),this._v("，比如说：")])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"language-javascript extra-class"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cellList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("forEach")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("item"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" index"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  item"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extend "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n  "),n("span",{attrs:{class:"token comment"}},[t._v("//这个时候做一些什么事情")]),t._v("\n  item"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extend "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token boolean"}},[t._v("false")]),t._v("\n  "),n("span",{attrs:{class:"token comment"}},[t._v("//这个时候再做一些什么事情")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("这种代码，并不会触发任何 Dom 上的更新，因为 Vue 有个"),s("code",[this._v("虚拟Dom")]),this._v("的机制，它先会在"),s("code",[this._v("虚拟Dom")]),this._v("上实现我们的行为，然后再判断要不要更新实际的 Dom。如果直接在 mounted 中去获取 Dom，则可能什么都拿不到(mounted 时 Dom 未必 已经渲染完毕)。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"updated"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#updated","aria-hidden":"true"}},[this._v("#")]),this._v(" Updated")])},function(){var t=this.$createElement,s=this._self._c||t;return s("li",[s("p",[this._v("类型:"),s("code",[this._v("Function")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[this._v("updated: function () {\n  this.$nextTick(function () {\n    // Code that will run only after the\n    // entire view has been re-rendered\n  })\n}\n")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[s("strong",[this._v("该钩子在服务器端渲染期间不被调用。")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("blockquote",[s("p",[this._v("博主通过实践之后简述一下这个钩子的注意事项及作用")]),s("p",[this._v("注意事项：data 发生变化且改变 Dom 时则会调用一次 Updated，所以请不要在 Updated 中给会影响 Dom 的 data 赋值，这样会造成无限循环。")]),s("p",[this._v("作用：每次因 data 更新导致的 Dom 更新则会触发该钩子，我们可以通过这个来记录一些 Dom 刷新时自己需要记录的数据。")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"vm-nexttick-callback"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#vm-nexttick-callback","aria-hidden":"true"}},[this._v("#")]),this._v(" Vm.$nextTick([callback])")])},function(){var t=this.$createElement,s=this._self._c||t;return s("li",[s("p",[s("strong",[this._v("参数")]),this._v("：")]),s("ul",[s("li",[s("code",[this._v("{Function} [callback]")])])])])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("li",[n("p",[n("strong",[t._v("用法")]),t._v("：")]),n("p",[t._v("将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。它跟全局方法 "),n("code",[t._v("Vue.nextTick")]),t._v(" 一样，不同的是回调的 "),n("code",[t._v("this")]),t._v(" 自动绑定到调用它的实例上。")]),n("blockquote",[n("p",[t._v("2.1.0 起新增：如果没有提供回调且在支持 Promise 的环境中，则返回一个 Promise。请注意 Vue 不自带 Promise 的 polyfill，所以如果你的目标浏览器不是原生支持 Promise (IE：你们都看我干嘛)，你得自行 polyfill。")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("li",[s("p",[s("strong",[this._v("示例")]),this._v("：")]),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[this._v("new Vue({\n  // ...\n  methods: {\n    // ...\n    example: function () {\n      // 修改数据\n      this.message = 'changed'\n      // DOM 还没有更新\n      this.$nextTick(function () {\n        // DOM 现在更新了\n        // `this` 绑定到当前实例\n        this.doSomethingElse()\n      })\n    }\n  }\n})\n")])])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("blockquote",[s("p",[this._v("博主通过实践之后简述一下这个方法的作用：")]),s("p",[this._v("通过代码去触发 Dom 的更新，也就是说你对"),s("code",[this._v("Dom")]),this._v("更新这个行为有了把控，通过其回调可以马上在更新之后做一些什么事情。")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"实践"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#实践","aria-hidden":"true"}},[this._v("#")]),this._v(" 实践")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("看完 Updated 和 Vue.nextTick 的作用之后，想必聪明的同学已经知道"),s("code",[this._v("在什么时候获取Dom元素的高度值这个时机")]),this._v('及"绕过"'),s("code",[this._v("虚拟Dom")])])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"language-javascript extra-class"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[n("span",{attrs:{class:"token comment"}},[t._v("//我们将获取的消息数据列表项全部设置为展开，然后触发一次Dom更新后将数据列表项全部设置为收缩。")]),t._v("\n"),n("span",{attrs:{class:"token comment"}},[t._v("//this.cellList为数据列表，extend属性定义是否展开，extendDisplay属性定义是否提供`展开/收缩功能`")]),t._v("\n"),n("span",{attrs:{class:"token comment"}},[t._v("//this.extendList记录展开时的高度,this.shrinkList记录收缩时的高度")]),t._v("\n"),n("span",{attrs:{class:"token comment"}},[t._v("//this.extendDisplay记录需要关闭`展开/收缩功能`的index值")]),t._v("\n"),n("span",{attrs:{class:"token function"}},[t._v("mounted")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$http"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("post")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token constant"}},[t._v("API")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token constant"}},[t._v("MESSAGE")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token constant"}},[t._v("LIST")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" params"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" pageNo"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("page "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("then")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("data "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" \t  "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),n("span",{attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("data"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("length "),n("span",{attrs:{class:"token operator"}},[t._v(">")]),t._v(" "),n("span",{attrs:{class:"token number"}},[t._v("0")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            data"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("forEach")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("item"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" index"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                item"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extend "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n                item"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extendDisplay "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n            "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n            "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("page"),n("span",{attrs:{class:"token operator"}},[t._v("++")]),t._v("\n        "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cellList "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" data\n        "),n("span",{attrs:{class:"token comment"}},[t._v("//刷新Dom")]),t._v("\n        "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("$nextTick")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),n("span",{attrs:{class:"token comment"}},[t._v("// 刷新DOM时执行")]),t._v("\n            "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cellList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("forEach")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("item"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" index"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                item"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extend "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token boolean"}},[t._v("false")]),t._v("\n            "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n        "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),n("span",{attrs:{class:"token comment"}},[t._v("//因data改变导致的Dom变化会触发updated钩子")]),t._v("\n"),n("span",{attrs:{class:"token function"}},[t._v("updated")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extendList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("length "),n("span",{attrs:{class:"token operator"}},[t._v("<")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cellList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("length "),n("span",{attrs:{class:"token operator"}},[t._v("||")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("shrinkList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("length "),n("span",{attrs:{class:"token operator"}},[t._v("<")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cellList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("length"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$refs"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cellContent"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("forEach")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("item"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" index"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),n("span",{attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cellList"),n("span",{attrs:{class:"token punctuation"}},[t._v("[")]),t._v("index"),n("span",{attrs:{class:"token punctuation"}},[t._v("]")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extend "),n("span",{attrs:{class:"token operator"}},[t._v("&&")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extendList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("length "),n("span",{attrs:{class:"token operator"}},[t._v("<")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cellList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("length"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extendList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("push")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("window"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("getComputedStyle")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("item"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("height"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                "),n("span",{attrs:{class:"token comment"}},[t._v("// console.log('展开时', this.extendList)")]),t._v("\n            "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("else")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token operator"}},[t._v("!")]),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cellList"),n("span",{attrs:{class:"token punctuation"}},[t._v("[")]),t._v("index"),n("span",{attrs:{class:"token punctuation"}},[t._v("]")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extend "),n("span",{attrs:{class:"token operator"}},[t._v("&&")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("shrinkList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("length "),n("span",{attrs:{class:"token operator"}},[t._v("<")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cellList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("length"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("shrinkList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("push")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("window"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("getComputedStyle")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("item"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("height"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                "),n("span",{attrs:{class:"token comment"}},[t._v("// console.log('收缩时', this.shrinkList)")]),t._v("\n            "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n        "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extendDisplay "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("[")]),n("span",{attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n        "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extendList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("forEach")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("item"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" index"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),n("span",{attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("item "),n("span",{attrs:{class:"token operator"}},[t._v("===")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("shrinkList"),n("span",{attrs:{class:"token punctuation"}},[t._v("[")]),t._v("index"),n("span",{attrs:{class:"token punctuation"}},[t._v("]")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extendDisplay"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("push")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("index"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n            "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),n("span",{attrs:{class:"token comment"}},[t._v("// 通过监听extendDisplay这个数组的变化，我们获取记录完成后的extendDisplay中index索引，通过这个来判断cellList的index项是否提供`展开/收缩功能`")]),t._v("\nwatch"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    extendDisplay"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        deep"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token boolean"}},[t._v("true")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n            "),n("span",{attrs:{class:"token function"}},[t._v("handler")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("newVal"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),n("span",{attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("shrinkList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("length "),n("span",{attrs:{class:"token operator"}},[t._v("===")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cellList"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("length"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extendDisplay"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("forEach")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("item"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" index"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                    "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cellList"),n("span",{attrs:{class:"token punctuation"}},[t._v("[")]),t._v("item"),n("span",{attrs:{class:"token punctuation"}},[t._v("]")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("extendDisplay "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token boolean"}},[t._v("false")]),t._v("\n                "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n            "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"总结："}},[s("a",{staticClass:"header-anchor",attrs:{href:"#总结：","aria-hidden":"true"}},[this._v("#")]),this._v(" 总结：")])},function(){var t=this.$createElement,s=this._self._c||t;return s("blockquote",[s("p",[this._v("另外官方并不推荐使用 nextTick 方法，因为这一定程度上会使流程复杂化，本来只是生命周期一条流水线这样下来，过多使用 nextTick 会存在很多不确定性。")])])}],!1,null,null,null);e.options.__file="README.md";s.default=e.exports}}]);