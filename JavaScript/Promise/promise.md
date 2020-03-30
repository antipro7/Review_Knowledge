> 学习一个新知识，我们要一定要了解这个新东西三个要素
> 是什么？怎么用？为什么？
## Promise是什么
> **Promise 是异步编程的一种解决方案，比传统的回调函数和事件相比更加的合理，强大**

### Promise产生的原因，解决的痛点
在实际项目中，如果遇到这样一个情况：我们需要根据第一个网络请求的结果，再去执行第二个网络请求，拿着第二个请求的结果再去执行第三个请求...
不使用 Promise 的代码大概长下面这样子：
```
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

作为一名21世纪的打字员，打代码一定要有所追求，一定要优雅。所以很多大佬就想办法解决这个问题，要用一个更加优雅的代码组织方式解决异步嵌套的问题。想到了类似下面这种同步的写法
```
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
- promise 常规写法：
```
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
2. Promise.reject
3. Promise.race
> 多个 Promise 任务同时执行，返回最先执行结束的 Promise 任务的结果，不管这个 Promise 结果是成功还是失败
4. Promise.all
> 将多个 Promise 实例，包装成一个新的 Promise 实例.
`const p = Promise.all([p1, p2, p3])`
> 多个 Promise 任务同时执行。如果全部成功执行，则以数组的方式返回所有 Promise 任务的执行结果。 如果有一个 Promise 任务 rejected，则只返回 rejected 任务的结果。

`实例方法：`
1. Promise.prototype.then
> 作用是为 Promise 实例添加状态改变时的回调函数。`then`方法的第一个参数是`reslove`状态的回调函数，第二个参数（可选）是`rejected`状态的回调函数
> `then`方法返回的是一个新的 Promise 实例，因此可以采用链式写法
2. Promise.prototype.catch
> 是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数

### Promise 与事件循环

### 升级之 async / await

#### 项目中的应用 
假如有这么个需求：有三个独立的请求，请求成功后改变数据，我们需要再请求成功后拿到最新数据，然后再去执行另一个函数。
```
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

### Promise 的实现
https://juejin.im/post/5aa3f7b9f265da23766ae5ae

### Promise 特点
源代码在此[请点击]()

**1. Promise 的立即执行性**
```
let p = new Promise((resolve, reject) => {
  console.log('create a promise');
  
  resolve('success')
})

console.log('after new Promise');

p.then(value => {
  console.log(value);
})

// 输出
create a promise
after new Promise
success
```
将 p.then 注释掉依然会执行console.log('create a promise')
这就说明仅仅是在刚创建(new) Promise 时，作为 Promise 参数被传入的函数都会被立即执行(没有调用变量p)，只是其中执行的代码可以是异步代码
ps: 因为promise内部的立即执行行，这个也会导致 `then` 立即执行(见下例)

**2. Promise 三种状态**
```
let p1 = new Promise((resolve, reject) => {
  resolve(1)
}).then(() => {
  console.log('p1.then'); // then的立即执行
});
let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(2)
  }, 500)
});
let p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(3)
  }, 500)
})

console.log('cl', p1);
console.log('cl', p2);
console.log('cl', p3);

setTimeout(() => { console.log('set', p2); }, 1000)
setTimeout(() => { console.log('set', p3); }, 1000)

p1.then(value => console.log('then', value))
p2.then(value => console.log('then', value))
p3.catch(err => console.log('then', err))
p3.then(value => console.log('then', value))

// 输出
cl Promise { <pending> }
cl Promise { <pending> }
cl Promise { <pending> }
p1.then
then undefined
then 2
then 3
set Promise { 2 }
set Promise { <rejected> 3 }
```























### 自测小集
[八段代码彻底掌握 Promise](https://juejin.im/post/597724c26fb9a06bb75260e8#heading-0)
[深入了解promise](https://github.com/mqyqingfeng/Blog/issues/98)

### 参考文章
- [es6-promise阮一峰](https://es6.ruanyifeng.com/#docs/promise)
- [面试精选之Promise](https://juejin.im/post/5b31a4b7f265da595725f322#heading-0)
- [八段代码彻底掌握 Promise](https://juejin.im/post/597724c26fb9a06bb75260e8#heading-0)
- [从一道Promise执行顺序的题目看Promise实现](https://juejin.im/post/5aa3f7b9f265da23766ae5ae)
- [ES6系列之我们来聊聊 Promise](https://github.com/mqyqingfeng/Blog/issues/98)
