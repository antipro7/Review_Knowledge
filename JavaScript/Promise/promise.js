// promise的立即执行性
/** 
let p = new Promise((resolve, reject) => {
  console.log('create a promise');
  
  resolve('success')
})

console.log('after new Promise');

p.then(value => {
  console.log(value);
})
*/

// output
// create a promise
// after new promise
// success
// 将 p.then 注释掉依然会执行console.log('create a promise')
// 这就说明作为Promise参数的函数会被立即执行，只是其中执行的代码可以是异步代码

// -------------------------------------------------

// Promise的三种状态
/** */
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

console.log(p1);
console.log(p2);
console.log(p3);