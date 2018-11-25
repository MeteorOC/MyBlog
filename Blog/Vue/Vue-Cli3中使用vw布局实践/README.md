## Vue-Cli3中使用vw布局实践

### 一、前言

在之前的一个Hybrid App中我们使用了flexible.js+px2-rem Webpack插件实现移动端自适应的功能，我们发现这种方案能够解决大部分移动端适配的问题，但是总是会有小部分机型我们需要额外适配。

前几天扒了下资料，大漠老师已经弃用了该方案，随着`viewport`单位越来越受到众多浏览器的支持，自适应适配也从rem转成了vw。

> 相关链接：
>
> [如何在Vue项目中使用vw实现移动端适配](https://www.w3cplus.com/mobile/vw-layout-in-vue.html)
>
> [使用Flexible实现手淘H5页面的终端适配](https://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html)

### 二、实践

大漠老师使用的这个方案发布于2018-01-25，距我进行实践的时间已经过去差不多一年，而这个时候VueCli版本也升级到了3。

如果说只是根据博文，是无法让vw布局生效的，主要是.postcssrc.js这个配置文件不生效的问题。

在VueCli3官网，我们可以看到对于PostCSS的支持，它是这么描述的：

> Vue CLI 内部使用了 PostCSS。
>
> 你可以通过 `.postcssrc` 或任何 [postcss-load-config](https://github.com/michael-ciniawsky/postcss-load-config) 支持的配置源来配置 PostCSS。也可以通过 `vue.config.js` 中的 `css.loaderOptions.postcss` 配置 [postcss-loader](https://github.com/postcss/postcss-loader)。
>
> 我们默认开启了 [autoprefixer](https://github.com/postcss/autoprefixer)。如果要配置目标浏览器，可使用 `package.json` 的 [browserslist](https://cli.vuejs.org/zh/guide/browser-compatibility.html#browserslist) 字段。

但是.postcssrc.js配置文件并没有起到任何效果。

但如果在vue.config.js中使用那想必是百分百ok的，找了一些资料，其引用的方式也有区别，最终是实现了博文中的效果。

```javascript
module.exports = {
    css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-write-svg')({ utf8: false }),
          require('postcss-import')({}),
          require('postcss-url')({}),
          require('postcss-aspect-ratio-mini')({}),
          require('cssnano')({
            preset: 'advanced',
            autoprefixer: false,
            'postcss-zindex': false
          }),
          require('postcss-px-to-viewport')({
            viewportWidth: 750, // (Number) The width of the viewport.
            viewportHeight: 1334, // (Number) The height of the viewport.
            unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
            viewportUnit: 'vw', // (String) Expected units.
            selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px.
            minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
            mediaQuery: false // (Boolean) Allow px to be converted in media queries.
          })
        ]
      }
    }
  }
}
```

配置完成后，查看DevServer或者编译过后的产物就会发现，非内联px单位全部被转化成了vw。

### 三、Todo

弄清楚为什么VueCli3中.postcssrc.js失效。