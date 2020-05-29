## async 函数
> async 是 Generator 函数的语法糖

#### 介绍
ES2017 引入了 async 函数，使异步操作变的更加方便
> async 函数是什么？一句话，它就是 Generator 函数的语法糖。
进一步说，async 函数可以看作 将多个异步操作，包装成一个 promise 对象，而 await 命令就是内部 then 命令的语法糖

async 函数对 Generator 函数的改进，体现在一下四点

**1.内置执行器**
Generator 函数的执行必须依靠执行器，需要调用 next 方法，所以有了 co 模块。
而 async 函数自带执行器，执行与普通函数一样

**2.更好的语义**
```js
// 以读取两个文件为例，对比 async 和 generator 写法上的区别
// 实际意义还有很大区别
const gen = function* () {
  const f1 = yield readFile('...1')
  const f2 = yield readFile('...2')
}

const async = async function () {
  const f1 = await readFile('...1')
  const f2 = await readFile('...2')
}
```
从写法上看，async,await 代替了 *,yield。async 表示函数内有异步操作，await 表示紧跟在后面的表达式需要等待其结果。
yield 前的 f1 是没有值的，它的值是下一步 next 的参数。await 前的 f1 是可有值的

**3.更广的适用性**
co 模块约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。

**4.返回值是 Promise**
async 函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用 then 方法指定下一步的操作。

进一步说，async 函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而 await 命令就是内部 then 命令的语法糖。

#### 语法
async 函数返回一个 Promise 对象。

**1. async 函数返回什么**
async 函数返回的一定是一个 Promise 对象
```js
async function r() {
  let a = await 'hello world'
  return a
}
r() // Promise {<resolved>: 'hello world'}

async function n_r() {
  let a = await 'hello world'
}
n_r() // Promise {<resolved>: undefined}
```
值有三种：1.内部有 return, 有返回值。2.无 return， 返回 undefined。3.返回报错

**2. （重点）await 命令**
await 后面可接收三种表达式
- Promise 对象，返回该对象的结果
- 不是 Promise 对象，直接返回对应的值
- thenable 对象（即定义then方法的对象），将其等同于 Promise 对象

```js
class Sleep {
  constructor(timeout) {
    this.timeout = timeout
  }
  then(resolve, reject) {
    const startTime = Date.now()
    setTimeout(() => {
      return resolve(Date.now() - startTime)
    }, this.timeout)
  }
}
(async () => {
  const sleepTime = await new Sleep(1000)
  console.log(sleepTime)
})()
// 1000
----
上面代码中，await 命令后面的 Sleep 实例不是 Promise 对象，
但是其中定义了 then 方法，await 命令将其视为 Promise 处理了
```

> JavaScript 一直没有休眠的语法，现在借助 await 命令就可以实现让程序停顿指定时间（在这停顿ba~）
```js
function sleep(interval) {
  return new Promise(resolve => {
    setTimeout(resolve, interval)
  })
}

(async function async() {
  for (let i = 0; i <= 5; i++) {
    console.log(i)
    await sleep(1000)
  }
})()
// 一秒输出一个数，从 0 到 5
// 这就是一道经典的面试题了（一次从零输出至五，考察闭包）
```

**3. 使用注意点**
1. 多个 await 命令后的异步操作，如果不存在继发关系，最好让它们同时触发
```js
 let foo = await getFoo()
 let bar = await getBar()
 // getFoo 和 gerBar 是两个独立异步操作，被写成了继发关系。
 // 这样 getBar 必须在 getFoo 后才执行，耗时，不好

// 同时执行
// 1
let [foo, bar] = await Promise.all([getFoo(), getBar()])

// 2
let fooPromise = getFoo()
let barPromise = getBar()
let foo = await fooPromise
let bar = await barPromise
```

2. await 命令只能用在 async 函数中，普通函数中会报错。（特殊情况 `顶层 await`）

3. 处理异常
如果 async 后面的异步操作出错，相当于 async 函数返回的 Promise 对象状态变为 reject
处理 async 异常，建议是 **使用 try...catch 代码块**
```js
// 不论多少个 await,统一放在 try...catch 中
async function main() {
  try {
    const val1 = await firstStep()
    const val2 = await secondStep(val1)
    const val3 = await thirdStep(val1, val2)
  } catch(err) {
    console.error(err)
  }
}
```

**4. async 的实现原理**
async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数内
```js
async function fn(args) { ... }

// 等同于
function fn(args) {
  return spawn(function* () {
    // ...
  })
}
```
> 所有的 async 函数都可以写成上面的第二种形式，其中 `spawn` 函数就是 `自动执行器`
```js
// 实现 spawn
function spwan(genF) {
  return new Promise((resolve, reject) => {
    const gen = genF()

    function step(nextF) {
      // 执行 next 命令
      let next
      try {
        next = nextF()
      } catch(e) {
        return reject(e)
      }

      if (next.done) {
        return resolve(next.value)
      }

      // 返回数值为 next.value Promise 对象
      Promise.resolve(next.value).then(v => {
        step(() => gen.next(v))
      }, e => {
        step(() => gen.throw(e))
      })
    }

    step(() => gen.next(undefined))
  })
}
```

**5. 与 其他异步处理方法 对比**
下面我们以获取 github 用户信息为例，进行对比
```js
// 获取用户信息函数
function getGithubUserInfo() {
  return new Promsie((resolve, reject) => {
    fetch('https://api.github.com/users/antipro7')
      .then(data => resolve(data.json()))
      .catch(err => reject(err))
  })
}
```
> promise 方法
```js
function byPromise() {
  getGithubUserInfo()
    .then(data => {
      console.log(data)
    })
    .then()
    ...
    .catch(err => console.log(err))
}
byPromise()
```
Promise 的方式解决了 **回调地狱** 问题，但是如果处理流程再复杂的话，将会使用太多的 `then` 方法，每个流程步骤都包含在 `then` 中，语义化不明显。如果需要用到另一个异步的结果，就会在 `then` 中嵌套了

---
> Generator 方法
```js
function* byGenerator() {
  const userInfo = yield getGithubUserInfo()
  return userInfo
}

const g = byGenerator()
const result = g.next().value

result.then(v => {
  console.log(v)
}).catch(err => {
  console.log(err)
})
```
Generator 解决了 Promise 的一些问题，流程更加直观语义化。但是 Generator 的问题是其执行函数，获取数据时必须使用执行器，会写大量的 `next` 命令

---
> async 方法
```js
async function byAsync() {
  try {
    let userInfo = await getGithubUserInfo()
    return userInfo
  } catch(e) {
    console.log(e)
  }
}

byAsync().then(v => console.log(v))
```
`async` 函数完美的解决了上面两种方式的问题。流程清晰，直观、语义明显。操作异步流程就如同操作同步流程。