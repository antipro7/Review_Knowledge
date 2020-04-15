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

p4.then(value => { console.log('p4 = ' + value); });

p3.then(value => { console.log('p3 = ' + value); });

p2.then(value => { console.log('p2 = ' + value); })

p1.then(value => { console.log('p1 = ' + value); })