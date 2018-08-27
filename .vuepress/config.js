module.exports = {
  title: 'Meteor', // 设置网站标题
  base: '/MyBlog/', // 设置站点根路径
  repo: 'https://github.com/MeteorOCC/MyBlog/', // 添加 github 链接
  dest: './dist',
  description: '欢迎来到我的个人页面',
  // chainWebpack: (config, isServer) => {
  //   config
  //     .output
  //     .publicPath('./')
  // },
  themeConfig: {
    // 添加导航栏
    nav: [{
        text: '主页',
        link: '/'
      }, {
        text: '博客',
        link: '/common/'
      },
      {
        text: '随笔',
        link: '/essays/'
      },
      {
        text: '项目',
        link: '/project/'
      },
      {
        text: 'github',
        // 这里是下拉列表展现形式。
        items: [{
            text: 'focus-outside',
            link: 'https://github.com/MeteorOC'
          },
          {
            text: 'stylus-converter',
            link: 'https://github.com/MeteorOC'
          }
        ]
      }
    ]
  }
}