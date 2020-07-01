## 执行上下文 / 作用域 / 闭包
> 本文可以看做是一篇总结，是我阅读冴羽老师的《深入系列文章》和其他大佬的文章总结而来
> 相关知识内容可以直接看参考文章，我会加上自己的理解

## 作用域
**主要内容：**
作用域指的是代码中定义变量的区域
作用域规定了当前执行代码如何查找变量
JS 采用的词法作用域，也就是静态作用域。函数的定义域在定义的时候就决定了

看下例子1:
```js
var scope = 'global scope'
function checkscope() {
  var scope = 'local scope'
  function f() {
    return scope
  }

  return f()
}

checkscope()
```
```js
var scope = 'global scope'
function checkscope() {
  var scope = 'local scope'
  function f() {
     return scope
  }

  return f
}

checkscope()()
```
上述两段代码都会打印 `local scope`，原因就是因为 JS 采用的静态作用域，函数的作用域是在函数创建时规定的。

> 而引用《JavaScript权威指南》的回答就是：
JavaScript 函数的执行用到了作用域链，这个作用域链是在函数定义的时候创建的。嵌套的函数 f() 定义在这个作用域链里，其中的变量 scope 一定是局部变量，不管何时何地执行函数 f()，这种绑定在执行 f() 时依然有效。

虽然两端代码执行结果是一样的，但是究竟为什么会这样呢，就要看下一节 [JS 执行上下文](#EC)

**`小题:`**
1. 通过两段代码理解 函数作用域是在定义时决定的
```js
// eg1
var value = 1;

function bar() {
  var value = 2;
  console.log(value);
}

bar(); // 输出 --》 2

// eg2
var value = 1;

function foo() {
  console.log(value);
}

function bar() {
  var value = 2;
  foo();
}

bar(); // 输出 --》 1
```

2. 包裹函数需要注意的点
```js
var a = 10;
var o = {
  a: 11,
  b: {
    fn: function () {
      console.log(a);
    }
  }
}

o.b.fn()
```
输出是 10，因为 fn 中打印 a 并不能读取到对象 o 的 a 属性。
fn 的作用域链是 `[AO, Global.VO]`

<span id='EC'><span>
## JS 执行上下文

### 什么是执行上下文
执行上下文就是指代码执行的环境，JS 中运行任何的代码都是在执行上下文中运行。

### 执行上下文重要属性
对于每个执行上下文，都有三个重要属性
 - [变量对象（Variable Object, VO）]()<br>首先初始化函数的参数arguments，提升函数声明和变量声明
 - [作用域链（Scope chain）]()<br>作用域链就是从当前作用域开始一层一层向上寻找某个变量，直到找到全局作用域还是没找到，就宣布放弃。这种一层一层的关系，就是作用域链。
 - [this]() <br>确定 this 指向

### 执行上下文类型
 - 全局上下文
 - 函数上下文
 - eval 函数上下文和 with 函数上下文（不推荐）
<br>

**全局执行上下文** 是最外层的执行环境。在浏览器中，为 `window` 对象，即全局对象。所有全局变量和函数都是作为 `window` 对象的属性和方法创建的。一个程序中只会有一个全局执行上下文。

**函数上下文** 

## 参考文章
- [JavaScript深入之词法作用域和动态作用域](https://github.com/mqyqingfeng/Blog/issues/3)
- [JavaScript深入之执行上下文栈](https://github.com/mqyqingfeng/Blog/issues/4)
- [JavaScript深入之变量对象](https://github.com/mqyqingfeng/Blog/issues/5)
- [深入理解Javascript执行上下文机制](https://mp.weixin.qq.com/s?__biz=MzA4ODYyMDI3NA==&mid=2247484093&idx=1&sn=e66973501fe562603544ebcc04a54b9c&chksm=90262f20a751a636323cf1393270af12e9bfc474ce0d56b9d174344bc9ca880e7e60714425ee&scene=126&sessionid=1591864652&key=41690070450697480e73999315feed7831d728a13c56d0dd8eae88ec233ce06118fd11ecba46f97b940eadf31f11bc34bf8197b5255f682401aae71e62266dd87d2ef82d5a3f2561269b0d7775dbfe29&ascene=1&uin=MzYyNjI1Mzk1&devicetype=Windows+10+x64&version=62090070&lang=zh_CN&exportkey=AfmmOibBmJk68yHBVekfqSc%3D&pass_ticket=vIzx8TwQOCfbvn2vBzCRIduClUIrjuvz%2F0HoQeCKq2aebY2kHTvN3sjd3bQh034C)
