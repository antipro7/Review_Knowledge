### Generator 基本概念
Generator 函数是 ES6 提供的一种`异步编程解决方案`

Generator 函数语法上可以理解成，是一个状态机，封装了多个内部状态。函数内部每个 `yield` 的语句定义了不同的内部状态

执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

> 遍历器对象请查看 [iterator](https://es6.ruanyifeng.com/#docs/iterator)
> Generator 详细内容请看阮大大ES6 [Generator 函数的语法](https://es6.ruanyifeng.com/#docs/generator)

####基本用法
特征：`星号*` 与 `yield` 表达式

**1. 创建 Generator 函数**
```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
```

**2. 调用过程**
与普通函数不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是遍历器对象（Iterator Object）。

下一步，必须调用遍历器对象的 `next` 方法，使得指针移向下一个状态。

Generator 函数是分段执行的，yield 表达式是暂停执行的标记，而 next 方法可以恢复执行。
```js
let hw = helloWorldGenerator();
// helloWorldGenerator {<suspended>}

hw.next() // {value: "hello", done: false}
hw.next() // {value: "world", done: false}
hw.next() // {value: "ending", done: true}
hw.next() // {value: undefined, done: true}
hw.next() // {value: undefined, done: true}
// 没有 return 就返回 undefined，有的话就返回对应的值。之后在执行 next 就返回 undefined
```

**3. yield 与 next 方法的参数**
> 遍历器对象的 `next` 方法的运行逻辑如下。
（1）遇到 `yield` 表达式，就暂停执行后面的操作，并将紧跟在 `yield` 后面的那个表达式的值，作为返回的对象的 `value` 属性值。
（2）下一次调用 `next` 方法时，再继续往下执行，直到遇到下一个 `yield` 表达式。
（3）如果没有再遇到新的 `yield` 表达式，就一直运行到函数结束，直到 `return` 语句为止，并将 `return` 语句后面的表达式的值，作为返回的对象的 `value` 属性值。
（4）如果该函数没有 `return` 语句，则返回的对象的 `value` 属性值为 `undefined`。

看段代码
```js
function* gen(x) {
  var a = yield x + 1;
  console.log('a', a)

  var b = yield a + 2;
  console.log('b', b);

  var c = yield x + 3;
  console.log('c', c);

  return 4
}

var g = gen(11)
g.next() // {value: 12, done: false}
g.next() // a undefined // {value: NaN, done: false}
g.next() // b undefined // {value: 14, done: false}
g.next() // c undefined // {value: 4, done: true}
```
每次遇到 `yield`，都会返回表达式后面的值。但是可以看到，a b c 三个的值全是 undefined。这表示 `yield` 表达式本身没有返回值，或者说总是返回 `undefined`。所以 a b c 都没有被赋值。
那如何给 a b c 赋值呢？ `next` 方法可以带一个参数，该参数就会被当作上一个 `yield` 表达式的返回值。
```js
function* foo(x) {
  let y = 2 * (yield (x + 1));
  let z = yield (y / 3);
  return (x + y + z);
}

let a = foo(5);
a.next(); // {value: 6, done: false}
a.next(); // {value: NaN, done: false} 
// y -> undefinded 除以 3 -> NaN
a.next(); // {value: NaN, done: true} // return NaN

let b = foo(5);
b.next(); // {value: 6, done: false}
b.next(12); // {value: 8, done: false}
b.next(13); // {value: 42, done: true}
```

### Generator 函数的异步应用
涉及知识：JS 单线程，异步概念

**1. 异步编程的传统方法**
- 回调函数
- 事件监听
- 发布/订阅
- Promise 对象

Generator 函数将 JavaScript 异步编程带入了一个全新的阶段