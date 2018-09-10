## SplitChunksPlugin

最开始的时候`chunk`(及在其中导入的模块)内部通过Webpack图中的`parent-child`关系相互联动。

从Webpack4开始，`CommonsChunkPlugin`被删除，新增`optimization.splitChunks`和`optimization.runtimeChunk`这两个选项来代替`CommonsChunkPlugin`的功能并优化。

### 默认情况

默认情况下的`SplitChunksPlugin`适合大多数用户。

`SplitChunksPlugin`默认情况下仅会影响按需加载的模块(更改初始模块会影响HTML文件应该包含的脚本及运行项)

Webpack根据以下条件自动拆分模块：

* 可以共享新`chunk`或来自`node_modules`文件夹的模块
* 新`chunk`将大于30kb(min+gz之前)
* 最大异步请求数小于或等于5
* 初始页面加载时最大异步请求数将小于或等于3

当满足最后两个条件时，会首先选择最大的`chunk`进行分割。

For Example

```javascript
//index.js
//dynamically import a.js
import('./a');
```

```javascript
// a.js
import "react"
```

打包结果：创建一个包含`react`的单独`chunk`，导入调用的时候，这个`chunk`和包含的原始`chunk`异步加载

Why？

* 该`chunk`来自模块的node_modules
* `react`大于30kb
* 调用时异步请求数为2
* 非影响初始页面加载的请求

Example2：

```javascript
//entry.js
//dynamically import a.js and b.js
import('./a')
import('./b')
```

```javascript
// a.js
import './helpers' // helpers is 40kb in size
```

```javascript
//b.js
import './helpers'
import './more-helpers'// more-helpers is also 40kb in size
```

打包结果：创建一个单独`chunk`，内含`./helpers`所有的依赖项，调用时，模块和原始`chunk`异步加载。

Why？

* 两个导入的js含共享的`./helpers`
* `helpers`大于30kb
* 调用时异步请求数为2
* 非影响初始页面加载的请求

Webpack认为如果像`helpers`这样的代码块通过额外的请求来使用，性能是要优于将`helpers`放入每个`chunk`导致`helpers`被下载两次的。尽管`额外的请求`依然是个额外的负担，但是至少它比连续下载两次更好更快的完成了任务。

### 供开发人员定制的配置文件

对于那些想对SplitChunksPlugin默认状况进行修改以适应项目的开发人员，Webpack提供了可选的配置选项来更好的满足开发人员的要求。

> `CommonsChunkPlugin`会导致下载的代码多过所需的代码，异步效率上面比较低，难以使用，过程也难以被理解。
>
> `SplitChunksPlugin`解决了上述大部分问题，但是在一些构建较为特殊的项目中，可能会导致一些意想不到的问题

#### Configuring cache groups(缓存组？)

> Vendor，一般译为第三方依赖。比如说项目中像Vue、Vue-router、FinoChat、vee-validate、mint-UI、Vuex、Axios这类从第三方引入可以直接使用其功能的模块都将被Webpack打包至Vendor中。

默认将所有来自`node_modules`的模块分配给`vendor`

可以将模块分配给多个`cache groups`，然后选择优先度较高的`priority`(`priority`选项)的`cache groups`或者优先度较高的`chunk`

#### 形成新块的基本配置

当满足所有的options时，来自相同`chunk`和`cache groups`的模块将形成新的`chunk`

options:

* `minSize` （默认值30000即30kb）`chunk`最小大小
* `minChunks`（默认值1）拆分前共享模块的最小`chunk`数
* `maxInitialRequests`(默认值3) 入口的最大异步请求数
* `maxAsyncRequests`(默认值5) 按需加载时的最大异步请求数

#### 命名

控制被分割的`chunk`的名字，`name`为可选项

当`name`为`true`时，Webpack会自动帮你命名(基于`chunks`和`cache groups`中的key)被分割的`chunk`的名字，否则将传递字符串或者方法的名为`chunk`的名字。

当`name`匹配为入口`entry`的名字，那么`entry`将会被移除。

#### `optimization.splitChunks.automaticNameDelimiter`

默认情况下，Webpack将使用初始名或者`chunk`的名字来生成名称，比如说`vendors~main.js`

如果你的项目与`~`这个关键字有冲突，可以通过这个选项设置为适用于项目的其他任何值，比如说`-`

#### 选择模块

`test`选项控制被`cache group`选择的模块

如果省略，它将选择所有模块，一般来说这个选项不可被忽略。

可以是正则表达式（一般也是这么用），也可以是字符串或者函数。

可匹配绝对路径的模块或者`chunk`名称，匹配`chunk`名称时，将选择这个`chunk`内的所有模块。

#### 选择`chunk`

`chunks`选项可以配置所选的`chunk`

`chunks`有三个值：`initial`,`async`,`all`。

`reuseExistingChunk`当模块完全匹配时，该选项允许重用现有`chunk`而不是创建新`chunk`

可以按照`cache group`进行控制

### `optimization.splitChunks.chunks: all`

初始`chunk`将受到影响(即使是未按需加载的模块)，这样甚至可以在entry point和按需加载的模块之间共享`chunk`

这是推荐的配置。

## `optimization.splitChunks`

配置`SplitChunksPlugin`的默认行为

```javascript
splitChunks: {
    chunks: "async",
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        },
    default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
        }
    }
}
```

以下是一些示例和效果：

Example1

创建一個`commons` `chunk`，其中包括entry之間共享的所有代碼。

```javascript
splitChunks: {
    cacheGroups: {
        commons: {
            name: "commons",
            chunks: "initial",
            minChunks: 2
        }
    }
}
```

> 此配置可以拓展初始以来包，建议在不立即需要模块時使用按需加载

Example2

创建一個`vendors` `chunk`

```javascript
splitChunks: {
    cacheGroups: {
        commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all"
        }
    }
}
```

> 包含所有第三方包的大`chunk`。建议仅包含核心框架和实用依赖，其它的业务上的东西建议按需加载。

## `optimization.runtimeChunk`

单独生成一个`chunk`，用于管理所有`chunk`的依赖和按需加载。