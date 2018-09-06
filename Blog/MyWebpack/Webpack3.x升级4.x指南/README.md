### Webpack3.x升级到Webpack4.x指南

这篇指引文章仅仅叙述最终影响用户的主要更改项，有关更多的详细信息，请参阅[更改日志](https://github.com/webpack/webpack/releases)

### Node.js V4

Node.js V4或更低版本则需将其升级到V6或更高版本

### CLI

CLI已经移到单独的包：webpack-cli，需要在使用webpack之前安装它，请参阅[基本设置](https://webpack.js.org/guides/getting-started/#basic-setup)

### 更新插件

许多第三方插件需要升级到最新版本才可以兼容Webpack4.x(简单的来说就是如果你的重要依赖插件较多，最好去npm库看看它们的支持情况)

### 模式

将新的[`mode`](https://webpack.js.org/concepts/mode/)选项添加到配置中，根据配置类型将值设置为production或者development

webpack.config.js

```javascript
module.exports = {
    // ...
    mode:'production'
}
```

或者你可以通过CLI传递它(一般而言这样做不太推荐)：`--mode production`/`--mode development`

### 已经弃用和删除的插件

这些插件可以从配置中删除，因为它们在生产模式下是默认的:

webpack.config.js

```javascript
module.exports={
    // ...
    plugins:[
        -    new NoEmitOnErrorsPlugin(),
        -    new ModuleConcatenationPlugin(),
        -    new DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") })
        -    new UglifyJsPlugin()
    ]
}
```

这些插件在开发模式下是默认的

webpack.config.js

```js
module.exports = {
  // ...
  plugins: [
		-    new NamedModulesPlugin()
  ],
}
```

*弃用和被删除的插件*

Webpack.confi.js

```javascript
module.exports = {
  // ...
  plugins: [
    -    new NoErrorsPlugin(),
    -    new NewWatchingPlugin()
  ],
}
```

## CommonsChunkPlugin

Optimization.spitChunks上位，CommonsChunkPlugin惨遭抛弃。

链接是[`optimization.splitChunks`](https://webpack.js.org/configuration/optimization/#optimization-splitchunks/)的详细信息，默认配置可满足大部分要求

> 从统计数据生成HTML时，可使用optimization.splitChunk.chunks:'all'，这在大多数情况下是最佳配置。

### imporrt()和CommonJS

当使用`import()`加载非ESM时，返回结果在webpack4中会被更改。现在您需要访问`default`属性以从`module.exports`获取值。

非esm.js

```javascript
module.exoprts={
    sayHello:()=>{
        consoe.log('hello world');
    }
}
```

example.js

```javascript
function sayHello(){
    import('./non-esm.js').then(module=>{
        module.default.sayHello()
    })
}
```

### json和loaders

现在，当使你用自定义loader去转换`.json`文件时，你需要添加module `type`字段的值

webpack.config.js

```javascript
module.exports = {
  // ...
  rules: [
    {
      test: /config\.json$/,
      loader: 'special-loader',
+     type: 'javascript/auto',
      options: {...}
    }
  ]
};
```

依然使用json-loader时， 可不用特意写上这一项，因为这已经默认处理了。

```javascript
module.exports = {
  // ...
  rules: [
    {
-     test: /\.json$/,
-     loader: 'json-loader'
    }
  ]
};
```

## module.loaders

`module.loaders` 自webpack2以来已被弃用，现在其已被删除而转用[`module.rules`](https://webpack.js.org/configuration/module/#rule)。