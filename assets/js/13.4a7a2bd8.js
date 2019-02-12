(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{162:function(e,a,t){"use strict";t.r(a);var r=t(0),s=Object(r.a)({},function(){this.$createElement;this._self._c;return this._m(0)},[function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"content"},[t("h2",{attrs:{id:"项目结构架构概述："}},[t("a",{staticClass:"header-anchor",attrs:{href:"#项目结构架构概述：","aria-hidden":"true"}},[e._v("#")]),e._v(" 项目结构架构概述：")]),t("h3",{attrs:{id:"项目架构：三级依赖"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#项目架构：三级依赖","aria-hidden":"true"}},[e._v("#")]),e._v(" 项目架构：三级依赖")]),t("p",[t("img",{attrs:{src:"/MyBlog/%E4%B8%89%E7%BA%A7%E4%BE%9D%E8%B5%96%E6%9E%B6%E6%9E%84%E5%9B%BE.png",alt:"img"}})]),t("blockquote",[t("p",[e._v("如图所示，项目分为八大公共库。内含项目运作所需的公共方法/资源/样式/对第三方依赖的处理/Webpack 配置。")]),t("p",[e._v("公共页面库里面存储了整个 APP 内都需要用到的"),t("code",[e._v("通用")]),e._v("页面，本质上跟模块是一样的，只不过称呼不一样。而每个模块都像是一个微型总库，只不过产物和总库不一样。")]),t("p",[e._v("总库经过 Webpack 构建库产出的是一个完整的，含 html、js、css 的前端项目。而各公共库、模块库产出的仅为经过 Webpack 构件库处理后压缩混淆的 js、css 代码，或直接被总库所用，或被路由库引用后再被总库所用。")])]),t("h4",{attrs:{id:"工作原理："}},[t("a",{staticClass:"header-anchor",attrs:{href:"#工作原理：","aria-hidden":"true"}},[e._v("#")]),e._v(" 工作原理：")]),t("p",[t("strong",[e._v("代码仓库")]),e._v("：Gogs")]),t("p",[t("strong",[e._v("私有 Npm 库")]),e._v("：Verdaccio")]),t("p",[t("strong",[e._v("自动构建")]),e._v("：Drone")]),t("p",[t("strong",[e._v("流程")]),e._v("：每个开发者都会有自己的一个"),t("code",[e._v("所有平台共享")]),e._v("的账号，开发者仅需将代码推向 Gogs 中，由 DevOps 工程师部署的脚本对推上的内容进行简单校验并对版本号进行修改(该步骤是经过各方沟通后决定)确认无误后，由 CI 账户（开发者无权限）推送至 Verdaccio，在公司的私有 Drone 页面可以看到推送过程。")]),t("p",[e._v("这样开发者就可以用 npm 工具来管理自己所发布的 package（这个 package 的意思就是将开发者的代码进行压缩混淆后的产物，在 Verdaccio 上存储。如果 A 开发者没有 B 开发者 Gogs 仓库的权限，那么这是 A 开发者看到 B 开发者代码的唯一方式。）")]),t("h4",{attrs:{id:"架构优点："}},[t("a",{staticClass:"header-anchor",attrs:{href:"#架构优点：","aria-hidden":"true"}},[e._v("#")]),e._v(" 架构优点：")]),t("p",[e._v("权限控制优秀，源码保密性强。")]),t("p",[e._v("在严格的权限管理下，开发者仅需简单的推送代码即可完成功能的迭代，每个开发者负责的模块交集少，从模块的角度上来说，代码污染情况很少发生。")]),t("h4",{attrs:{id:"架构缺点："}},[t("a",{staticClass:"header-anchor",attrs:{href:"#架构缺点：","aria-hidden":"true"}},[e._v("#")]),e._v(" 架构缺点：")]),t("p",[e._v("① 公共库之间代码污染明显，如果不是公共库管理者，对于其中的行为及变量传递必然不是很清楚。")]),t("p",[e._v("比如说对于工具库而言，内含各种公共方法/第三方依赖修改，不可避免的会操作到全局变量库的内容。此时就会需要在工具库各文件内都引入 store 变量。")]),t("p",[e._v("② 调试困难。")]),t("p",[e._v("一般的项目架构是走分支合并的路线，在一个文件夹内开发。各种变量及依赖关系一目了然，搜索方便。功能验证仅需开启 DevServer 即可看到结果，无需做二次三次 Check。")]),t("p",[e._v("而在三级依赖架构中，我们每次推送代码，首先自己的模块内会启动 DevServer 进行校验一次，然后推送至 Verdaccio 后需要在总库 Upgrade package 后再校验一次。其中会浪费一定的时间。")]),t("p",[e._v("而且如果我们看到，A/B/C 三个库可能都依赖一个公共方法，我们对这个公共方法进行了修改，那么可能需要先推送公共方法至 Gogs 库走流程，等构建完毕再轮流到 A/B/C 三个库去验证我们代码的可靠性。")]),t("p",[e._v("目前项目还是没有一个供开发者使用的 Dev 环境，开发者做了什么改动/尝试，都会一步到位的到预生产环境，这就会让测试非常迷惑：为什么之前出现的一个问题现在又频繁复现，到底是开发者最终的代码问题还是他们在修改功能中引发的问题？")]),t("p",[e._v("③Webpack 配置繁琐，依赖引入麻烦。")]),t("p",[e._v("就说 Vue-router 官方允许我们使用懒加载的方式异步加载路由，这样可以让单页应用不再臃肿。")]),t("p",[e._v("但是如果按照项目的三级依赖来说，我们首先在应用异步加载上面就出现了困难，因为我们不是直接在目录中引入一个.vue 文件那么简单，我们面对的是一个经过 Webpack 处理的 index.js 大文件。")]),t("p",[e._v("对于初步接触框架的开发者来说这无疑是个很让人困惑的事情->为什么我按照官方给的例子自行尝试的时候发现没有效果/报错？到底是我的问题还是 Vue 官方的问题还是项目框架的问题？")]),t("p",[e._v("经过后面和云翔一起探讨，我们发现其实 Vue-router 在对于懒加载的处理上，其接受的是一个 Function，内返回一个 Promise 对象。对于经过 Webpack 处理后的模块，其本身就是一个 Promise，直接按照官方给的例子自然是无法正常运作。我们在其外面包裹了一层 Function 后异步加载才算是正常运作。")]),t("p",[e._v("但是方案并不完美，因为我们仅能按"),t("code",[e._v("模块")]),e._v("来异步加载，这已经是三级依赖在目前 Webpack 极致下的极限，除非我们可以去改动 Webpack 的源码或者自己创建一个 loader 之类的东西专门处理这种情况。")]),t("p",[e._v("④ 封闭")]),t("p",[e._v("源码不暴露，开发者之间交流困难，这样容易造成代码体积变大，同样功能的实现方式不同。")]),t("p",[e._v("同样代码的事先方式不同，如果需求变更，那么三个开发者可能都需要去修改自己的代码。实际上这种代码仅需一个人维护一份即可，这也是同事之间 Review 代码的重要性。")]),t("p",[e._v("⑤ 低效")]),t("p",[e._v("Npm 依赖的本意是提供一个可靠/稳定的版本，本身功能并非迭代代码。")]),t("p",[e._v("而 Git 被发明的初衷是代码版本管理，更倾向于迭代。")]),t("p",[e._v("通过 Npm 依赖，我们每次更新代码都需要漫长的遍历所有的模块（包括第三方稳定依赖），也就是说从寻径来说已经慢了一大截。")]),t("h3",{attrs:{id:"项目架构改进想法：gitsubmodule"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#项目架构改进想法：gitsubmodule","aria-hidden":"true"}},[e._v("#")]),e._v(" 项目架构改进想法：gitSubmodule")]),t("p",[t("img",{attrs:{src:"/MyBlog/gitsubmodule%E6%9E%B6%E6%9E%84%E5%9B%BE.jpg",alt:"image-20181010125153863"}})]),t("p",[e._v("gitSubmodule 主要的作用就是一种权限管理：比如说一个父模块里面包含了很多子模块")]),t("p",[e._v("1.对于这些子模块，父模块本身可以本地修改子模块查看效果，但是无法提交对子模块进行提交。")]),t("p",[e._v("2.这些子模块需要有其权限的开发者才能够提交。")]),t("p",[e._v("3.父模块可以更新子模块拉取最新的代码。")]),t("h4",{attrs:{id:"工作原理：-2"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#工作原理：-2","aria-hidden":"true"}},[e._v("#")]),e._v(" 工作原理：")]),t("p",[t("strong",[e._v("代码仓库")]),e._v("：Gogs")]),t("p",[t("strong",[e._v("自动构建")]),e._v("：Drone")]),t("p",[t("strong",[e._v("流程")]),e._v("：每个开发者都会拥有一个类似于"),t("code",[e._v("三级依赖架构")]),e._v('总库代码仓库的只读权限，这就是项目开发的主目录。主目录下面包含 N 个子模块，开发者需要查看的时候可在总库"修改"子模块的内容方便调试但无法影响到子模块。更新子模块代码也无需 Npm 参与。CI 账号定期在总库拉取最新的子模块代码并 build 一下即可放入我们的服务器。')]),t("h4",{attrs:{id:"架构优点：-2"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#架构优点：-2","aria-hidden":"true"}},[e._v("#")]),e._v(" 架构优点：")]),t("p",[e._v("① 调试简单，哪里出现问题直接修改代码即可看到结果。")]),t("p",[e._v("② 层级明显，清晰。")]),t("p",[e._v("③ 高效。无需 Npm 参与，直接 Git 拉取代码即可看到最新功能。")]),t("p",[e._v("④ 污染小。无论是公共库/模块/总库，均可独立开发互不影响，又可清晰的看到其它开发者加入了什么内容。")]),t("p",[e._v("⑤ 简单，基本的 Vue CLI 内的 Webpack 配置即可满足项目的所有需求。严格遵循官方的开发规范，所有文档均可简单应用。")]),t("h4",{attrs:{id:"架构缺点：-2"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#架构缺点：-2","aria-hidden":"true"}},[e._v("#")]),e._v(" 架构缺点：")]),t("p",[e._v("相对于三级依赖架构，对源码无任何保护性。")])])}],!1,null,null,null);s.options.__file="README.md";a.default=s.exports}}]);