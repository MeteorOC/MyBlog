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

Javascipt只有函数构成作用域(注意理解作用域,只有`函数的{}`构成作用域,`对象的{}`以及 `if(){}`都不构成作用域)，data是一个函数时，每个组件实例都有自己的作用域，每个实例相互独立,不会相互影响

而我们知道，Vue组件是可以任意复用的

```javascript
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

假设新建组件我们设置的data是一个直接的对象：

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

对应缘由下面的解释，我们可以理解上述结果：对象的{}不构成作用域，component1与component2的data实际上对应的是一样的内存地址。所以对其中的任何一个data对象的修改，都会影响到其它的data对象。

### 三、解决

```javascript
const MyComponent = function() {
    this.data = this.data();
};
MyComponent.prototype.data = function() {
    return {
        a: 1,
        b: 2,
    }
};
```

既然知道了缘由，那么就可以清楚的知道如何解决，让这个data为函数，返回对象即可。