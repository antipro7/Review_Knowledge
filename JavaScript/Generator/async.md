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
