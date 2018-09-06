### HtmlWebpackPlugin自定义最终的html输出文件

在一般项目及Vue-cli里面，都是借助借助Webpack提供的`HtmlWebpackPlugin`插件注入自己的html模板来`自定义`最终输出的文件。

`自定义`一说也是有待商榷，毕竟也只是自己创建一个html文件，自己引用一下网页的favicon icon及一些cdn上面的第三方js，然后由`HtmlWebpackPlugin`插件将项目的所有依赖按照设定好的方式注入其中。

一般来说这种实现是简单高效没问题的，但是现在磊哥提了这么一个需求：可以通过配置来决定编译的时候项目中是否含有sourceMap文件，而项目的分库比较特别，每个模块都是不同的子库，每个子库有自己的SourceMap，在生产模式下是不能带有SourceMap代码的，但是测试的时候需要SourceMap方便我们对Bug追踪。

仔细阅读`HtmlWebpackPlugin`中的文档，发现在不满意`HtmlWebpackPlugin`插件注入资源的情况下还可以通过内置的模板引擎来实现来html产物的自定义。

**本体配置**：

| Name                   | Type                        | Default        | Description                                                  |
| ---------------------- | --------------------------- | -------------- | ------------------------------------------------------------ |
| **title**              | `{String}`                  | `Webpack App`  | The title to use for the generated HTML document             |
| **filename**           | `{String}`                  | `'index.html'` | The file to write the HTML to. Defaults to `index.html`. You can specify a subdirectory here too (eg: `assets/admin.html`) |
| **template**           | `{String}`                  | ``             | ` webpack` require path to the template. Please see the [docs](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md) for details |
| **templateParameters** | `{Boolean|Object|Function}` | ``             | Allows to overwrite the parameters used in the template      |
| **templateContent**    | `{String|Function}`         | ``             | A string that contains (or function that returns) the content of the template. `template` and `templateContent` options **may not both be used**. Overwrites `template` option |
| **inject**             | `{Boolean|String}`          | `true`         | `true || 'head' || 'body' || false`Inject all assets into the given `template`or `templateContent`. When passing `true` or `'body'` all javascript resources will be placed at the bottom of the body element. `'head'` will place the scripts in the head element |
| **favicon**            | `{String}`                  | ``             | Adds the given favicon path to the output HTML               |
| **meta**               | `{Object}`                  | `{}`           | Allows to inject `meta`-tags. E.g. `meta: {viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'}` |
| **minify**             | `{Boolean|Object}`          | `false`        | Pass [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference)'s options as object to minify the output |
| **hash**               | `{Boolean}`                 | `false`        | If `true` then append a unique `webpack`compilation hash to all included scripts and CSS files. This is useful for cache busting |
| **cache**              | `{Boolean}`                 | `true`         | Emit the file only if it was changed                         |
| **showErrors**         | `{Boolean}`                 | `true`         | Errors details will be written into the HTML page            |
| **chunks**             | `{?}`                       | `?`            | Allows you to add only some chunks (e.g only the unit-test chunk) |
| **chunksSortMode**     | `{String|Function}`         | `auto`         | Allows to control how chunks should be sorted before they are included to the HTML. Allowed values are `'none' | 'auto' | 'dependency' | 'manual' | {Function}` |
| **excludeChunks**      | `{Array.<string>}`          | ``             | Allows you to skip some chunks (e.g don't add the unit-test chunk) |
| **xhtml**              | `{Boolean}`                 | `false`        | If `true` render the `link` tags as self-closing (XHTML compliant) |

---

**minify** 的配置列表

| Option                          | Description                                                  | Default                                                      |
| ------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `caseSensitive`                 | Treat attributes in case sensitive manner (useful for custom HTML tags) | `false`                                                      |
| `collapseBooleanAttributes`     | [Omit attribute values from boolean attributes](http://perfectionkills.com/experimenting-with-html-minifier/#collapse_boolean_attributes) | `false`                                                      |
| `collapseInlineTagWhitespace`   | Don't leave any spaces between `display:inline;`elements when collapsing. Must be used in conjunction with `collapseWhitespace=true` | `false`                                                      |
| `collapseWhitespace`            | [Collapse white space that contributes to text nodes in a document tree](http://perfectionkills.com/experimenting-with-html-minifier/#collapse_whitespace) | `false`                                                      |
| `conservativeCollapse`          | Always collapse to 1 space (never remove it entirely). Must be used in conjunction with `collapseWhitespace=true` | `false`                                                      |
| `customAttrAssign`              | Arrays of regex'es that allow to support custom attribute assign expressions (e.g. `'<div flex?="{{mode != cover}}"></div>'`) | `[ ]`                                                        |
| `customAttrCollapse`            | Regex that specifies custom attribute to strip newlines from (e.g. `/ng-class/`) |                                                              |
| `customAttrSurround`            | Arrays of regex'es that allow to support custom attribute surround expressions (e.g. `<input {{#if value}}checked="checked"{{/if}}>`) | `[ ]`                                                        |
| `customEventAttributes`         | Arrays of regex'es that allow to support custom event attributes for `minifyJS` (e.g. `ng-click`) | `[ /^on[a-z]{3,}$/ ]`                                        |
| `decodeEntities`                | Use direct Unicode characters whenever possible              | `false`                                                      |
| `html5`                         | Parse input according to HTML5 specifications                | `true`                                                       |
| `ignoreCustomComments`          | Array of regex'es that allow to ignore certain comments, when matched | `[ /^!/ ]`                                                   |
| `ignoreCustomFragments`         | Array of regex'es that allow to ignore certain fragments, when matched (e.g. `<?php ... ?>`, `{{ ... }}`, etc.) | `[ /<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/ ]`                       |
| `includeAutoGeneratedTags`      | Insert tags generated by HTML parser                         | `true`                                                       |
| `keepClosingSlash`              | Keep the trailing slash on singleton elements                | `false`                                                      |
| `maxLineLength`                 | Specify a maximum line length. Compressed output will be split by newlines at valid HTML split-points |                                                              |
| `minifyCSS`                     | Minify CSS in style elements and style attributes (uses [clean-css](https://github.com/jakubpawlowicz/clean-css)) | `false` (could be `true`, `Object`, `Function(text, type)`)  |
| `minifyJS`                      | Minify JavaScript in script elements and event attributes (uses [UglifyJS](https://github.com/mishoo/UglifyJS2)) | `false` (could be `true`, `Object`, `Function(text, inline)`) |
| `minifyURLs`                    | Minify URLs in various attributes (uses [relateurl](https://github.com/stevenvachon/relateurl)) | `false` (could be `String`, `Object`, `Function(text)`)      |
| `preserveLineBreaks`            | Always collapse to 1 line break (never remove it entirely) when whitespace between tags include a line break. Must be used in conjunction with `collapseWhitespace=true` | `false`                                                      |
| `preventAttributesEscaping`     | Prevents the escaping of the values of attributes            | `false`                                                      |
| `processConditionalComments`    | Process contents of conditional comments through minifier    | `false`                                                      |
| `processScripts`                | Array of strings corresponding to types of script elements to process through minifier (e.g. `text/ng-template`, `text/x-handlebars-template`, etc.) | `[ ]`                                                        |
| `quoteCharacter`                | Type of quote to use for attribute values (' or ")           |                                                              |
| `removeAttributeQuotes`         | [Remove quotes around attributes when possible](http://perfectionkills.com/experimenting-with-html-minifier/#remove_attribute_quotes) | `false`                                                      |
| `removeComments`                | [Strip HTML comments](http://perfectionkills.com/experimenting-with-html-minifier/#remove_comments) | `false`                                                      |
| `removeEmptyAttributes`         | [Remove all attributes with whitespace-only values](http://perfectionkills.com/experimenting-with-html-minifier/#remove_empty_or_blank_attributes) | `false` (could be `true`, `Function(attrName, tag)`)         |
| `removeEmptyElements`           | [Remove all elements with empty contents](http://perfectionkills.com/experimenting-with-html-minifier/#remove_empty_elements) | `false`                                                      |
| `removeOptionalTags`            | [Remove optional tags](http://perfectionkills.com/experimenting-with-html-minifier/#remove_optional_tags) | `false`                                                      |
| `removeRedundantAttributes`     | [Remove attributes when value matches default.](http://perfectionkills.com/experimenting-with-html-minifier/#remove_redundant_attributes) | `false`                                                      |
| `removeScriptTypeAttributes`    | Remove `type="text/javascript"` from `script` tags. Other `type` attribute values are left intact | `false`                                                      |
| `removeStyleLinkTypeAttributes` | Remove `type="text/css"` from `style` and `link` tags. Other `type` attribute values are left intact | `false`                                                      |
| `removeTagWhitespace`           | Remove space between attributes whenever possible. **Note that this will result in invalid HTML!** | `false`                                                      |
| `sortAttributes`                | [Sort attributes by frequency](https://github.com/kangax/html-minifier#sorting-attributes--style-classes) | `false`                                                      |
| `sortClassName`                 | [Sort style classes by frequency](https://github.com/kangax/html-minifier#sorting-attributes--style-classes) | `false`                                                      |
| `trimCustomFragments`           | Trim white space around `ignoreCustomFragments`.             | `false`                                                      |
| `useShortDoctype`               | [Replaces the `doctype` with the short (HTML5) doctype](http://perfectionkills.com/experimenting-with-html-minifier/#use_short_doctype) | `false`                                                      |

项目中所用配置：

```javascript
new HtmlWebpackPlugin({
    filename: config.build.index,
    template: htmlPath,
    inject: false,
    minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
    },
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'dependency'
})
```

**核心点**：inject

先看看inject的解释

> true || 'head' || 'body' || false
>
> 所有资源注入写入`template`或`templateContent`。如果配置为`'true'`或`'body'`，那么所有javascript文件资源將被放置在body元素的底部。如果配置为`'head'`，那么將会把scripts放在head元素中。

经过测试，如果为`'false'`，则需要在html模板里面自行写脚本加载资源。

再看github上的介绍:

> The following variables are available in the template:
>
> - `htmlWebpackPlugin`: data specific to this plugin
>
>   - `htmlWebpackPlugin.files`: a massaged representation of the `assetsByChunkName` attribute of webpack's [stats](https://github.com/webpack/docs/wiki/node.js-api#stats)object. It contains a mapping from entry point name to the bundle filename, eg:
>
>     ```
>     "htmlWebpackPlugin": {
>       "files": {
>         "css": [ "main.css" ],
>         "js": [ "assets/head_bundle.js", "assets/main_bundle.js"],
>         "chunks": {
>           "head": {
>             "entry": "assets/head_bundle.js",
>             "css": [ "main.css" ]
>           },
>           "main": {
>             "entry": "assets/main_bundle.js",
>             "css": []
>           },
>         }
>       }
>     }
>     ```
>
>     If you've set a publicPath in your webpack config this will be reflected correctly in this assets hash.
>
>   - `htmlWebpackPlugin.options`: the options hash that was passed to the plugin. In addition to the options actually used by this plugin, you can use this hash to pass arbitrary data through to your template.
>
> - `webpack`: the webpack [stats](https://github.com/webpack/docs/wiki/node.js-api#stats) object. Note that this is the stats object as it was at the time the HTML template was emitted and as such may not have the full set of stats that are available after the webpack run is complete.
>
> - `webpackConfig`: the webpack configuration that was used for this compilation. This can be used, for example, to get the `publicPath` (`webpackConfig.output.publicPath`).
>
> - `compilation`: the webpack [compilation](https://webpack.js.org/api/compilation/) object. This can be used, for example, to get the contents of processed assets and inline them directly in the page, through `compilation.assets[...].source()` (see [the inline template example](https://github.com/jantimon/html-webpack-plugin/blob/master/examples/inline/template.jade)).

通过插件的内置模板引擎，则最终示例html模板如下：

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <link rel="shortcut icon" href="/resource/img/common/favicon.ico" />
  <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no,maximum-scale=1.0,viewport-fit=cover">
  <meta name="apple-mobile-web-app-status-bar-style" content="#009ee5" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-touch-fullscreen" content="yes">
  <meta name="theme-color" content="#009ee5">
  <link rel="stylesheet" href="/resource/PublicCSS/index.css">
  <!-- 加载原始css文件 -->
  <% htmlWebpackPlugin.files.css.forEach(function (cssFile) { %>
  <link rel="stylesheet" href="<%=cssFile %>">
  <% }) %>

  <!-- 初始化的js -->
  <% if (htmlWebpackPlugin.files.chunks.manifest) { %>
  <script src="<%=htmlWebpackPlugin.files.chunks.manifest.entry %>"></script>
  <% } %>

  <script src="<%=htmlWebpackPlugin.files.chunks['gfl.bootstrap'].entry %>" defer></script>

  <title>广发互联小贷</title>
</head>

<body ontouchstart="">
  <div id="LoadingApp">
    <img id="LoadingAppImg" data-src="/resource/img/common/home_loading.gif" alt="">
  </div>
  <div id="app"></div>
  <!-- built files will be auto injected -->
  <script src="/resource/icon/iconfont.js"></script>

  <!-- vendor的加载是需要优化的 -->
  <% if (htmlWebpackPlugin.files.chunks.vendor) { %>
  <script data-src="<%=htmlWebpackPlugin.files.chunks.vendor.entry %>"></script>
  <% } %>

  <!-- 其它的js全部加在最后面 -->
  <% htmlWebpackPlugin.files.js.forEach(function (jsFile) { %>
  <% if (jsFile.indexOf('gfl.bootstrap') === -1 &&
        jsFile.indexOf('manifest') === -1 &&
        jsFile.indexOf('vendor') === -1) { %>
  <script src="<%=jsFile %>"></script>
  <% } %>
  <% }) %>
</body>

</html>

```

