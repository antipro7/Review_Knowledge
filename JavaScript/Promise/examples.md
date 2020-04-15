

**1. Promise 的立即执行性**
```js
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

**2. Promise 三种状态**
```js
let p1 = new Promise((resolve, reject) => {
  resolve(1)
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
p3.then(value => console.log('then', value)) // 不会输出任何东西

// 输出
cl Promise { 1 }
cl Promise { <pending> }
cl Promise { <pending> }
then 1
then 2
then 3
set Promise { 2 }
set Promise { <rejected> 3 }
```
Promise 的内部实现是一个状态机，有三种状态`pending` `resolved` `rejected`.
当Promise刚创建完成时，处于`pending`状态
当Promise中的函数参数执行了`resolve`后，Promise由`pending`状态变成`resolved`状态
如果在Promise的函数参数中执行的是`reject`方法，那么Promise会由`pending`状态变成`rejected`状态。

**3. Promise 状态的不可逆性**
```js
let p1 = new Promise((resolve, reject) => {
  resolve('p1 - success1');
  resolve('p1 - success2');
})

let p2 = new Promise((resolve, reject) => {
  resolve('p2 - success');
  reject('p2 - reject')
})

p1.then(value => console.log(value))
p2.then(value => console.log(value))

// 输出
p1 - success1
p2 - success
```

**4. 链式调用**
```js
let p = new Promise((resolve, reject) => {
  resolve(1);
})

p.then(v => {
  console.log('1', v);
  return v * 2;
}).then(v => {
  console.log('2', v);
}).then(v => {
  console.log('3', v);
  return Promise.resolve('resolve');
}).then(v => {
  console.log('4', v);
  return Promise.reject('reject');
}).then(v => {
  console.log('resolve:', v);
}, err => {
  console.log('reject:', err);
})

// 输出
1 1
2 2
3 undefined
4 resolve
reject: reject
```

**5. Promise then() 回调异步性**
```js
let p = new Promise((resolve, reject) => {
  resolve('success');
})

p.then(v => {
  console.log(v);
})

console.log('I will console log in where');
```
Promise接收的函数参数是同步执行的，但then方法中的回调函数执行则是异步的，因此，"success"会在后面输出。

**6. Promise 中的异常**
```js
let p1 = new Promise((resolve, reject) => {
  foo.bar();
  resolve(1);
})

p1.then(value => {
  console.log('p1 then value', value);
}, err =>{
  console.log('p1 then err', err);
}).then(value => {
  console.log('p1 then then value', value);
}, err => {
  console.log('p1 then then err', value);
})

let p2 = new Promise((resolve, reject) => {
  resolve(2);
})

p2.then(value => {
  console.log('p2 then value', value);
  foo.bar();
}, err => {
  console.log('p2 then err', err);
}).then(value => {
  console.log('p2 then then value', value);
}, err => {
  console.log('p2 then then err', err);
  return 1;
}).then(value => {
  console.log('p2 then then then value', value);
}, err => {
  console.log('p2 then then then err', err);
})

// 输出
p1 then err: ReferenceError: foo is not defined
p2 then value: 2
p1 then then value: undefined
p2 then then err: ReferenceError: foo is not defined
p2 then then then value: 1
```
Promise中的异常由`then`参数中第二个回调函数`rejection`（Promise执行失败的回调）处理，异常信息将作为`Promise`的值。
异常一旦得到处理，then返回的后续Promise对象将恢复正常，并会被`Promise`执行成功的回调函数处理。
另外，需要注意p1、p2 多级`then`的回调函数是交替执行的，这正是由Promise then回调的异步性决定的

**需要注意的是**
[阮大神ES6 Promise catch](https://es6.ruanyifeng.com/#docs/promise#Promise-prototype-catch) 中介绍
> 一般来说，不要在then()方法里面定义 Reject 状态的回调函数（即then的第二个参数），总是使用catch方法。

但是 `catch` 与上面这种写法是不一样的，输出顺序是不一样的。
`Promise.prototype.catch()` 方法是 `.then(null, rejection)` 或 `.then(undefined, rejection)` 的别名。比上面的第二个参数 `err回调` 多一个回调，执行顺序推迟。

**7. Promise.resolve()**
```js
let p1 = Promise.resolve(1)
let p2 = Promise.resolve(p1)
let p3 = new Promise((resolve, reject) => {
  resolve(1)
})
let p4 = new Promise((resolve, reject) => {
  resolve(p1)
})

console.log(p1, p2, p3, p4);
console.log(p1 === p2, p1 === p3, p1 === p4, p3 === p4)
// output
// Promise { 1 } Promise { 1 } Promise { 1 } Promise { <pending> }
// true false false false

p4.then(value => { console.log('p4 = ' + value); });

p3.then(value => { console.log('p3 = ' + value); });

p2.then(value => { console.log('p2 = ' + value); })

p1.then(value => { console.log('p1 = ' + value); })

// output
// p3 = 1
// p2 = 1
// p1 = 1
// p4 = 1
```
`Promise.resolve(...)` 定义：可以接收一个值或者一个 Promise 对象作为参数。
参数 | 返回值
---- | ----
普通值 | 一个resolve状态的Promise对象，对象的值就是这个参数
Promise对象 | 直接返回这个Promise

因此 `p1 === p2`，单通过 `new` 创建的 `Promise` 对象 每一个都是不同的对象。
为什么 `p4` 的 `then` 最先调用，但在控制台上是最后输出结果的呢？因为`p4`的 `resolve` 中接收的参数是一个 `Promise` 对象 `p1` ，`resolve` 会对 `p1` ”拆箱“，获取 `p1` 的状态和值，但这个过程是异步的，可参考下一节

**8. resolve 与 reject**
