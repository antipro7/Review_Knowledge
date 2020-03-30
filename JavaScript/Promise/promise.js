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
// let p1 = new Promise((resolve, reject) => {
//   resolve(1)
// })
// let p2 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(2)
//   }, 500)
// });
// let p3 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     reject(3)
//   }, 500)
// })

// console.log('cl', p1);
// console.log('cl', p2);
// console.log('cl', p3);

// setTimeout(() => { console.log('set', p2); }, 1000)
// setTimeout(() => { console.log('set', p3); }, 1000)

// p1.then(value => console.log('then', value))
// p2.then(value => console.log('then', value))
// p3.catch(err => console.log('then', err))

// promise 状态的不可逆性
// let p1 = new Promise((resolve, reject) => {
//   resolve('p1 - success1');
//   resolve('p1 - success2');
// })

// let p2 = new Promise((resolve, reject) => {
//   resolve('p2 - success');
//   reject('p2 - reject')
// })

// p1.then(value => console.log(value))
// p2.then(value => console.log(value))

// 链式调用
// let p = new Promise((resolve, reject) => {
//   resolve(1);
// })

// p.then(v => {
//   console.log('1', v);
//   return v * 2;
// }).then(v => {
//   console.log('2', v);
// }).then(v => {
//   console.log('3', v);
//   return Promise.resolve('resolve');
// }).then(v => {
//   console.log('4', v);
//   return Promise.reject('reject');
// }).then(v => {
//   console.log('resolve:', v);
// }, err => {
//   console.log('reject:', err);
// })

// Promise then() 回调异步性
let p = new Promise((resolve, reject) => {
  resolve('success');
})

p.then(v => {
  console.log(v);
})

console.log('I will console log in where');