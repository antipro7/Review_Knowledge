## Promise是什么
> **Promise 是异步编程的一种解决方案，比传统的回调函数和事件相比更加的合理，强大**

### Promise产生的原因，解决的痛点
在实际项目中，如果遇到这样一个情况：我们需要根据第一个网络请求的结果，再去执行第二个网络请求，拿着第二个请求的结果再去执行第三个请求...
不使用 Promise 的代码大概长下面这样子：
```js
请求1 (function (请求结果1) {
  请求2 (function (请求结果2) {
    请求3 (function (请求结果3) {
      ...
    })
  })
})
```
这样看其实还好，没有很恐怖！
但是如果业务需求再复杂一些，这个请求就要一直叠加下去。
而且更糟糕的是，实际应用中，每一个请求都会对请求数据进行处理，这样代码就会变得十分难看臃肿，而且基本上这段代码无法复用。
这就是大名鼎鼎的 ***回调地狱***
> JS 实现异步是通过回调函数实现的。就是把任务的第二段单独写在一个函数里，等到第一段有了结果需要执行第二段时，直接调用这个回调函数。
> Promise 就是为了解决 `回调地狱` 问题提出的，它不是新的语法功能，而是一种新的写法，允许将回调函数的嵌套改变成链式调用。
Promise 最大的问题时代码冗余，一大堆then,原来的语义不清晰

作为一名21世纪的打字员，打代码一定要有所追求，一定要优雅。所以很多大佬就想办法解决这个问题，要用一个更加优雅的代码组织方式解决异步嵌套的问题。想到了类似下面这种同步的写法
```js
let 请求结果1 = 请求1();
let 请求结果2 = 请求2(请求结果1);
let 请求结果3 = 请求3(请求结果2);
...
// 还可以复用某一个请求
let 请求结果4 = 请求3(请求结果1);
let 请求结果5 = 请求2(请求结果3);
```
于是 Promise 规范就诞生了。

### Promise 规范
- Promise 构造函数：
Promise 对象是一个构造函数，用来生成 Promise 实例
```js
// 创建一个 promise 实例
const promise = new Promise(resolve, reject) {
  // ... some code 
  if (/* 异步操作成功 */) {
    resolve(value)
  } else {
    reject(error)
  }
}
```
Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject. 它们又是两个函数

- promise 常规写法：
```js
new Promise (请求1)
  .then(请求2(请求结果1))
  .then(请求3(请求结果2))
  .then(请求4(请求结果3))
  .then(请求5(请求结果4))
  .catch(...// 处理异常)
```
比较一下这种写法和上面的回调式的写法。我们不难发现，Promise 的写法更为直观，并且能够在外层捕获异步函数的异常信息。

- Promise 常用的方法有哪些？它们的作用是什么？

`类方法：`
1. Promise.resolve
Promise 对象必须 `reslove` 一个值才可以被之后的`then`接收。而`then`中的函数要`return`一个结果或者一个新的 Promise 对象 ( then 本身就会返回一个新 promise，如果没有 return 数据，下一个 then 接收的值就是`undefined` )，才可以让之后的`then`回调接收
> 
```js
let p = new Promise((reslove) => {
  reslove(2)
  // return 2 无法传递给下面的then
})
p.then(v => v).then(v => console.log(v)) // 2
```
2. Promise.reject
3. Promise.race
> 多个 Promise 任务同时执行，返回最先执行结束的 Promise 任务的结果，不管这个 Promise 结果是成功还是失败
4. Promise.all
> 将多个 Promise 实例，包装成一个新的 Promise 实例.
`const p = Promise.all([p1, p2, p3])`
> 多个 Promise 任务同时执行。如果全部成功执行，则以数组的方式返回所有 Promise 任务的执行结果。 如果有一个 Promise 任务 rejected，则只返回 rejected 任务的结果。

`实例方法：`
1. Promise.prototype.then
> 作用是为 Promise 实例添加状态改变时的回调函数。
第一个参数是`reslove`状态的回调函数
第二个参数（可选）是`rejected`状态的回调函数

`then`方法返回的是一个新的 Promise 实例，因此可以采用链式写法

`then` 这两个参数的返回值可以是一下三种情况中的一种
> 
> - `return` 一个同步的值，或者`undefined`(当没有返回一个有效值时，默认返回 `undefined`)，`then`方法将返回一个resolved状态的Promise对象，Promise对象的值就是这个返回值
> - `return`另一个 Promise，`then`方法将根据这个Promise的状态和值创建一个新的Promise对象返回
> - `throw`一个同步异常，`then`方法将返回一个`rejected`状态的Promise，值是该异常
2. Promise.prototype.catch
> 是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数

### Promise 与事件循环

### 升级之 async / await

假如有这么个需求：有三个独立的请求，请求成功后改变数据，我们需要再请求成功后拿到最新数据，然后再去执行另一个函数。
```js
function 1 () { return ...new Promise }
function 2 () { return ...new Promise }
function 3 () { return ...new Promise }
funciton 4 () { ... // 在1，2，3之后处理 }

// 在此触发上述函数
async function click () {
  await 1();
  await 2();
  await 3();
  4()
}
```


### 8题掌握 Promise
[Click Here](https://github.com/antipro7/Review_Knowledge/blob/master/JavaScript/Promise/examples.md)


### Promise 的实现
- [从一道Promise执行顺序的题目看Promise实现](https://juejin.im/post/5aa3f7b9f265da23766ae5ae)
- [简易版 Promise 实现（代码）]()






### 自测小集
- [八段代码彻底掌握 Promise](https://juejin.im/post/597724c26fb9a06bb75260e8#heading-0)
- [冴羽-深入了解promise](https://github.com/mqyqingfeng/Blog/issues/98)

### 参考文章
- [es6-promise阮一峰](https://es6.ruanyifeng.com/#docs/promise)
- [面试精选之Promise](https://juejin.im/post/5b31a4b7f265da595725f322#heading-0)
- [八段代码彻底掌握 Promise](https://juejin.im/post/597724c26fb9a06bb75260e8#heading-0)
- [从一道Promise执行顺序的题目看Promise实现](https://juejin.im/post/5aa3f7b9f265da23766ae5ae)
- [ES6系列之我们来聊聊 Promise](https://github.com/mqyqingfeng/Blog/issues/98)


