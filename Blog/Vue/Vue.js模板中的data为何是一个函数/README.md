## Vue.js模板中的data为何是一个函数

### 一、前言

官方给的例子中，我们可以看到，在新建Vue实例的时候，data其实也是可以直接以一个对象返回的，如下所示：

```javascript
// Vue 根实例
new Vue({
  data: {
    foo: 1
  },
  computed: {
    bar: function () { /* ... */ }
  },
  methods: {
    baz: function () { /* ... */ }
  }
})
```

那么为什么我们定义Vue模板的时候，需要将`data`以function的形式返回对象呢？

### 二、缘由

而我们知道，Vue组件是可以任意复用的

```javascript
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

在Vue中，组件的复用都是通过一个构造函数来完成，构造函数通过prototype来存储要共享的属性和方法，这样新new的组件就可以直接从prototype原型链中继承这些属性和方法，方便快捷。

比如像下面举例的函数MyComponent中我们设置的data是一个在其原型链上的对象：

```javascript
const MyComponent = function() {};
MyComponent.prototype.data = {
    a: 1,
    b: 2,
}
const component1 = new MyComponent();
const component2 = new MyComponent();

component1.data.a === component2.data.a; // true;
component1.data.b = 5;
component2.data.b // 5
```

Javascipt只有函数构成作用域(注意理解作用域,只有`函数的{}`构成作用域,`对象的{}`以及 `if(){}`都不构成作用域)，data是一个函数时，每个组件实例都有自己的作用域，每个实例相互独立,不会相互影响。

对应上面的解释：对象的{}不构成作用域，component1与component2的data实际上对应的是一样的内存地址。所以对其中的任何一个data对象的修改，都会影响到其它的data对象。

当然，这么说估计你还是会存留着疑惑，如果分别给component1和component2添加上它们的私有属性data，那么最后你得到的结果是它们互不干扰。

```javascript
const MyComponent = function() {};
const component1 = new MyComponent();
const component2 = new MyComponent();

component1.data = {
    a:1,
    b:2
}
component2.data = {
     a:2,
    b:1
}
console.log('component1.data.a',component1.data.a) //1
```

为什么一定要在原型链上面挂载data呢？对于我们来说不是仅仅只是需要访问到data么？

Vue初始化时会对data中的所有属性调用defineReactive方法，对data属性进行监听，而在组件内也一样，data必须经过处理才可以成为组件的data属性，构造函数通过prototype来存储要共享的属性和方法，对于构造函数正确的用法来说，data的函数化也成了必然。