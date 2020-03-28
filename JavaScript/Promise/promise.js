// promise的立即执行性
// let p = new Promise((resolve, reject) => {
//   console.log('create a promise');
  
//   resolve('success')
// })

// console.log('after new Promise');

// p.then(value => {
//   console.log(value);
// })

// ------ output ------
// create a promise
// after new promise
// success
/**
 * 将 p.then 注释掉依然会执行console.log('create a promise')
 * 这就说明仅仅是在刚创建(new) Promise 时，作为 Promise 参数被传入的函数都会被立即执行(没有调用变量p)，只是其中执行的代码可以是异步代码
 */

// -------------------------------------------------

// Promise的三种状态
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
// p3.then(value => console.log('then', value))