## 前端命名规范（参考菜鸟）

### 项目结构

```javascript
---/Module|Components|Common/
|---- /module_name                                     模块名
|---- /module_name/index.vue                           该模块下的Vue文件
|---- /module_name/children_module_name                模块的子模块
---/css/
|---- /base.css                                        重置浏览器样式
|---- /method_xxx.css                                  对某个功能/类名定义的全局样式
|---- /index.css									                     将上述css合并
---/js/
|---- /lib                      					             第三方依赖
|---- /lib/jquery.2.2.3.min.js  					             具体依赖，一定要有版本号
|---- /module|global function/                         js用于xx用途
|---- /module|global function/xx.js                    该用途下的js功能细分
---/img/
|---- /icon                                            路由对应的图片
|---- /page                                            小型通用图片
|---- /page/module_name/                               模块对应图片
|---- /common/                                         普通公用图片
```

### 项目命名规范

- 全部英文小写字母，可以使用中线，如非必要不可出现其他字符，如 login,my-order

- 调用 `/lib`里面的文件需包含版本号，压缩文件需包含`min`关键词，其他插件则可不包含，如：`/lib/jquery.1.9.1.js`

### 格式&编码

- 文本文件：`.xxx_UTF-8_\(无BOM)\_编码`
- 图片文件: `.png_(PNG-24)_ .jpg_(压缩率8-12)_`
- 动态图片:`.gif`
- 压缩文件:`.tar.gz` `.zip` `.rar`

### CSS 规范

#### 命名规范：

- 所有的命名用小写的英文单词
- 不使用简单的方位词直接命名，如"left"，"bottom"
- 不缩写单词，除非一看就明白的单词
- 长名称或词组可以使用下划线作为连接符
- 避免选择器嵌套层级过多，少于 3 级
- 不要随意使用 id，id 应该按需使用，而不能滥用
- 使用 CSS 缩写属性 ，比如 padding:0 10px 5px 5px 等等，这样精简代码同时又能提高用户的阅读体验。

#### **参考如下：**

| CSS 样式命名         | 说明                     |
| -------------------- | ------------------------ |
| 网页公共命名         |                          |
| wrapper              | 页面外围控制整体布局宽度 |
| container 或 content | 容器,用于最外层          |
| layout               | 布局                     |
| head, header         | 页头部分                 |
| foot, footer         | 页脚部分                 |
| nav                  | 主导航                   |
| sub_nav              | 二级导航                 |
| menu                 | 菜单                     |
| sub_menu             | 子菜单                   |
| side_bar             | 侧栏                     |
| sidebar_l, sidebar_r | 左边栏或右边栏           |
| main                 | 页面主体                 |
| tag                  | 标签                     |
| msg message          | 提示信息                 |
| tips                 | 小技巧                   |
| vote                 | 投票                     |
| friendlink           | 友情链接                 |
| title                | 标题                     |
| summary              | 摘要                     |
| login_bar            | 登录条                   |
| search_input         | 搜索输入框               |
| hot                  | 热门热点                 |
| search               | 搜索                     |
| search_output        | 搜索输出和搜索结果相似   |
| search_bar           | 搜索条                   |
| search_results       | 搜索结果                 |
| copyright            | 版权信息                 |
| branding             | 商标                     |
| logo                 | 网站 LOGO 标志           |
| site_info            | 网站信息                 |
| site_info_legal      | 法律声明                 |
| site_info_credits    | 信誉                     |
| join_us              | 加入我们                 |
| partner              | 合作伙伴                 |
| service              | 服务                     |
| regsiter             | 注册                     |
| arr arrow            | 箭头                     |
| guild                | 指南                     |
| site_map             | 网站地图                 |
| list                 | 列表                     |
| home_page            | 首页                     |
| sub_page             | 二级页面子页面           |
| tool, toolbar        | 工具条                   |
| drop                 | 下拉                     |
| dorp_menu            | 下拉菜单                 |
| status               | 状态                     |
| scroll               | 滚动                     |
| tab                  | 标签页                   |
| left right center    | 居左、中、右             |
| news                 | 新闻                     |
| download             | 下载                     |
| banner               | 广告条(顶部广告条)       |

#### 书写规范：

向"无 ID，无层级，无标签"准则靠拢，可有效提高重用性，减小文件大小，提升渲染效率

#### 注释：

用来区分页面的注释，如`/******************************************产品中心****************************************/`

模块的注释,如`/*首页导航栏*/`

#### 排列：不做硬性要求

- Positioning（定位，如 position，top，z-index）
- Box model（盒模型，如 display，box-sizing，width，border）
- Typographic（排版，如 font，line-height，text-align）
- Visual（视觉，如 background，color,opacity）
- Other（其他，如 cursor）

> 由于定位（positioning）可以从正常的文档流中移除元素，并且还能覆盖盒模型（box model）相关的样式，因此排在首位。盒模型决定了组件的尺寸和位置，因此排在第二位。 其他属性只是影响组件的内部（inside）或者是不影响前两组属性，因此排在后面。

### JS 规范

#### 命名规范：

**函数：**

命名方法：小驼峰式命名

命名规范：前缀应当是名词。(函数的名字前缀为动词，以此区分变量和函数)

命名建议：尽量在变量名字中体现所属类型，如:length、count 等表示数字类型；而包含 name、title 表示为字符串类型。

示例

```javascript
// 好的命名方式
var maxCount = 10
var tableTitle = 'LoginTable'

// 不好的命名方式
var setCount = 10
var getTitle = 'LoginTable'
```

| 动词 | 含义                         | 返回值                                                |
| ---- | ---------------------------- | ----------------------------------------------------- |
| can  | 判断是否可执行某个动作(权限) | 函数返回一个布尔值。true：可执行；false：不可执行     |
| has  | 判断是否含有某个值           | 函数返回一个布尔值。true：含有此值；false：不含有此值 |
| is   | 判断是否为某个值             | 函数返回一个布尔值。true：为某个值；false：不为某个值 |
| get  | 获取某个值                   | 函数返回一个非布尔值                                  |
| set  | 设置某个值                   | 无返回值、返回是否设置成功或者返回链式对象            |
| load | 加载某些数据                 | 无返回值或者返回是否加载完成的结果                    |

**常量:**

命名方法：名称全部大写

命名规范：使用大写字母和下划线来组合命名，下划线用以分割单词

```javascript
const MAX_COUNT = 10
const URL = 'http://gfloan.demo.com'
```

**文件：**

使用短线（-）或句点（.）作为分隔符号，推荐使用句点，最好使用小写英文字符，不要使用其他符号和扩展字符，如 jQuery UI 1.9.0 的源文件可命名为"jquery-ui-1.9.0.js"

使用 .js 扩展名，这个扩展名的兼容性最好。其实任何扩展名都可以，只要是 text 类型、编码正确即可

用句点分隔表示名称中的从属关系，范围大的在前，如 jQuery 的表单插件 Form 既可以命名为 jquery.form.js

**注释:**

使用多行注释,以/_开头，_/结尾

**性能:**

- 尽量选用局部变量而不是全局变量
- 尽量使用链式写法
- 尽量减少 DOM 调用
- 将 js 脚本放到页面底部
- 减少对 dom 的操作
- 选择器的选择：尽量不用标签选择器，能用 ID 选择器的就不用 class 选择器

### HTML 规范

#### 标签规范：

尽量减少标签层级

双标签必须闭合，单标签用斜线闭合

HTML 第一行统一使用 HTML5 标准<!DOCTYPE html>

一律统一标签结尾斜杠的书写形式：`<br />` `<hr />` 注意之间空格

避免使用已过时标签，如：`<font>` `<frame>` `<s>`

```
`<img>`标签默认缺省格式：`<img src="#" alt="缺省时文字" />`
```

`<a>`标签缺省格式：`<a href="#" title="链接名称">xxx</>` 注：`target="_blank"` 根据需求决定

style、link、script 可省略 type 属性，因为 text/css 和 text/javascript 分别是他们的默认值

#### 注意事项:

手机端的自适应布局尽量采用弹性布局，而不是百分比

`css`文件都 置于头部

HTML 换行缩进：采用 tab 空格

其他效果`js`及`统计代码` 文件置于尾部

手机端的页面都按 750px 来做，显示效果按 375px。
