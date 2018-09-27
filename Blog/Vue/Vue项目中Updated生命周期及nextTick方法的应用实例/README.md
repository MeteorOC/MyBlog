## Vue项目中Updated生命周期及nextTick方法的应用实例

### 前言

可能很多同学在撸Vue业务的时候基本没有用到Updated生命周期和nextTick方法吧，毕竟绝大部分业务下来，常用的生命周期`mounted`、`created`、`beforeCreated`已经足够使用了。

但是，本篇博文中想着重介绍一下Updated生命周期和nextTick方法，因为这两个方法解决了我一个头疼的问题。

在许多项目中应该都有一个消息页面，这个消息页面通过Ajax请求获取后端的数据列表，当字数超过N(我项中`N=2`)行的时候提供展开/收缩功能，收缩的时候只显示N行的字，多余的字用''...''代替，展开的时候该列表自适应高度展示所有的文字。

实际上如果仅仅是`收缩的时候只显示N行的字，多余的字用''...''代替，展开的时候该列表自适应高度展示所有的文字。`这个功能反倒是好解决的，参考：[多行文本的情况下，用省略号“...”隐藏超出范围的文本](http://www.css88.com/webkit/-webkit-line-clamp/)

但是，`当字数超过N行时提供展开/收缩功能`这个问题就不太好解决了，因为我们已经使用了CSS来解决问题，对于它是否超过N行这种行为，我们是不知道的。而在Dom元素中，我们可以看到在没有超过N行的时候，虽然展示有显示"..."，但是实际获取其值的时候还是所有的文字值，没有"…"供我们判断。

在前端历史长河中，一般都是使用：

![image-20180927104029227](/Users/meteor/Library/Application Support/typora-user-images/image-20180927104029227.png)

这种方法来解决，而考虑更周到一些，那就还要判断行高和平均字宽，等等。

如果想做的较为完美，那就要引入几个第三方解决库，而我是不太乐意的。

> 注意：`-webkit-box-orient`在被webpack编译的时候会被忽略掉，原因是`optimize-css-assets-webpack-plugin`这个插件的问题，它认为`-webkit-box-orient`是一个不标准的属性，不应该被应用到项目中，但是实际上较新的webkit浏览器都是支持的，这里可以使用下方代码块的代码来解决这个问题。
>
> ```scss
> /*! autoprefixer: off */
> -webkit-box-orient: vertical;
> /* autoprefixer: on */
> ```

### 想法

默认给所有的列表项都加上`展开/收缩功能`，先展开列表项记录它们展开时高度，再收缩列表项记录它们收缩时高度，对比两者高度，相同的则是不需要`展开/收缩功能`的项，而不同的则是需要`展开/收缩功能`的项。

理想很丰满现实很骨感，通过些许实践我碰到了阻碍，因为这些数据项都是通过V-for循环创建的，而`在什么时候获取Dom元素的高度值这个时机`便是一个问题，另一个问题则是如果通过代码级别的来控制其`展开/收缩`，比如说：

```javascript
this.cellList.forEach((item, index) => {
	item.extend = true
    //这个时候做一些什么事情
    item.extend = false
    //这个时候再做一些什么事情
})
```

这种代码，并不会触发任何Dom上的更新，因为Vue有个`虚拟Dom`的机制，它先会在`虚拟Dom`上实现我们的行为，然后再判断要不要更新实际的Dom。如果直接在mounted中去获取Dom，则可能什么都拿不到(mounted时未Dom已经渲染完毕)。

### Updated

* 类型:`Function`

* 详细:

  由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。

  当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用[计算属性](https://cn.vuejs.org/v2/api/#computed)或 [watcher](https://cn.vuejs.org/v2/api/#watch) 取而代之。

  注意 `updated` **不会**承诺所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕，可以用 [vm.$nextTick](https://cn.vuejs.org/v2/api/#vm-nextTick) 替换掉 `updated`：

```
updated: function () {
  this.$nextTick(function () {
    // Code that will run only after the
    // entire view has been re-rendered
  })
}
```

**该钩子在服务器端渲染期间不被调用。**

详阅：[Updated钩子](https://cn.vuejs.org/v2/api/#updated)

> 博主通过实践之后简述一下这个钩子的注意事项及作用
>
> 注意事项：data发生变化且改变Dom时则会调用一次Updated，所以请不要在Updated中给会影响Dom的data赋值，这样会造成无限循环。
>
> 作用：每次因data更新导致的Dom更新则会触发该钩子，我们可以通过这个来记录一些Dom刷新时自己需要记录的数据。

### Vm.$nextTick([callback])

- **参数**：

  - `{Function} [callback]`

- **用法**：

  将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。它跟全局方法 `Vue.nextTick` 一样，不同的是回调的 `this` 自动绑定到调用它的实例上。

  > 2.1.0 起新增：如果没有提供回调且在支持 Promise 的环境中，则返回一个 Promise。请注意 Vue 不自带 Promise 的 polyfill，所以如果你的目标浏览器不是原生支持 Promise (IE：你们都看我干嘛)，你得自行 polyfill。

- **示例**：

  ```
  new Vue({
    // ...
    methods: {
      // ...
      example: function () {
        // 修改数据
        this.message = 'changed'
        // DOM 还没有更新
        this.$nextTick(function () {
          // DOM 现在更新了
          // `this` 绑定到当前实例
          this.doSomethingElse()
        })
      }
    }
  })
  ```

- **参考**：[Vue.nextTick](https://cn.vuejs.org/v2/api/#Vue-nextTick)

> 博主通过实践之后简述一下这个方法的作用：
>
> 通过代码去触发Dom的更新，也就是说你对`Dom`更新这个行为有了把控，通过其回调可以马上在更新之后做一些什么事情。

### 实践

看完Updated和Vue.nextTick的作用之后，想必聪明的同学已经知道`在什么时候获取Dom元素的高度值这个时机`及"绕过"`虚拟Dom`

截取一些业务上面的代码来说明这次实践：

```javascript
//我们将获取的消息数据列表项全部设置为展开，然后触发一次Dom更新后将数据列表项全部设置为收缩。
//this.cellList为数据列表，extend属性定义是否展开，extendDisplay属性定义是否提供`展开/收缩功能`
//this.extendList记录展开时的高度,this.shrinkList记录收缩时的高度
//this.extendDisplay记录需要关闭`展开/收缩功能`的index值
mounted () {
    this.$http.post(API.MESSAGE.LIST, {}, { params: { pageNo: this.page } }).then(data => 	  {
        if (data.length > 0) {
            data.forEach((item, index) => {
                item.extend = true
                item.extendDisplay = true
            })
            this.page++
        }
        this.cellList = data
        //刷新Dom
        this.$nextTick(() => {
            // 刷新DOM时执行
            this.cellList.forEach((item, index) => {
                item.extend = false
            })
        })
    })  
},
//因data改变导致的Dom变化会触发updated钩子
updated () {
    if (this.extendList.length < this.cellList.length || this.shrinkList.length < this.cellList.length) {
        this.$refs.cellContent.forEach((item, index) => {
            if (this.cellList[index].extend && this.extendList.length < this.cellList.length) {
                this.extendList.push(window.getComputedStyle(item).height)
                // console.log('展开时', this.extendList)
            } else if (!this.cellList[index].extend && this.shrinkList.length < this.cellList.length) {
                this.shrinkList.push(window.getComputedStyle(item).height)
                // console.log('收缩时', this.shrinkList)
            }
        })
        this.extendDisplay = []
        this.extendList.forEach((item, index) => {
            if (item === this.shrinkList[index]) {
                this.extendDisplay.push(index)
            }
        })
    }
},
// 通过监听extendDisplay这个数组的变化，我们获取记录完成后的extendDisplay中index索引，通过这个来判断cellList的index项是否提供`展开/收缩功能`
watch: {
    extendDisplay: {
        deep: true,
            handler (newVal) {
            if (this.shrinkList.length === this.cellList.length) {
                this.extendDisplay.forEach((item, index) => {
                    this.cellList[item].extendDisplay = false
                })
            }
        }
    }
}

```

## 总结：

熟悉生命周期及一些API对我们开发大有裨益，推荐各位看一个框架之前先对官方文档通读一次。

> 另外官方并不推荐使用nextTick方法，因为这一定程度上会使流程复杂化，本来只是生命周期一条流水线这样下来，过多使用nextTick会存在很多不确定性。