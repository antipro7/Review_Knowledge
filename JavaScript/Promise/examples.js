let p1 = new Promise((resolve, reject) => {
  resolve(Promise.resolve('p1 resolve'))
})
let p2 = new Promise((resolve, reject) => {
  resolve(Promise.reject('p2 reject'))
})
let p3 = new Promise((resolve, reject) => {
  reject(Promise.resolve('p3 resolve'))
})

p1.then(value => {
  console.log('p1 fulfilled: ', value);
}, err => {
  console.log('p1 rejected: ', err);
})

p2.then(value => {
  console.log('p2 fulfilled: ', value);
}, err => {
  console.log('p2 rejected: ', err);
})

p3.then(value => {
  console.log('p3 fulfilled: ', value);
}, err => {
  console.log('p3 rejected: ', err);
})