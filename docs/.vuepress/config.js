module.exports = {
  // 启用自定义的主题
  theme: 'yubisaki',
  title: 'Meteor',
  base: '/',
  dest: './dist',
  repo: 'https://github.com/MeteorOCC/',
  description: "Meteor's Blog",
  port: 8080,
  // Google Analytics ID
  ga: 'xxxxx',
  // PWA support
  serviceWorker: true,
  // fuck IE
  evergreen: true,
  markdown: {
    // markdown-it-anchor 的选项
    anchor: { permalink: true },
    // markdown-it-toc 的选项
    toc: { includeLevel: [1, 2] },
    config: md => {
      md.use(require('markdown-it-task-lists')) // 一个 checkbox 的 TODO List 插件
        .use(require('markdown-it-imsize'), { autofill: true }) // 支持自定义 md 图片大小 ![](http://test.png =200x200)
    }
  },
  // 主题的一些配置
  themeConfig: {
    // 博客背景图片
    background: '/background/path',
    // github card
    // github: 'github username',
    // 博客的 logo
    logo: 'http://img5.178.com/overwatch/201602/249760978163/249761544066.png',
    // 定制文章标题颜色
    accentColor: '#ac3e40',
    // 每页显示的文章数量
    per_page: 5,
    // 创建文章的时间格式, 不设则不显示 可选 [yyyy-MM-dd HH:mm:ss]
    date_format: 'yyyy-MM-dd',
    // 和 vuepress 默认主题一样, 定制导航栏上的链接
    nav: [
      { text: 'HOME', link: '/' },
      { text: 'GITHUB', link: 'https://github.com/bloss' },
      { text: '关于我', link: '/about/' },
    ]
  }
}