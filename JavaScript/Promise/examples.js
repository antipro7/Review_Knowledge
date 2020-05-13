let p = new Promise((resolve) => {
  console.log('create a promise');
  
  resolve('success')
})

console.log('after new Promise');

p.then(value => {
  console.log(value);
})