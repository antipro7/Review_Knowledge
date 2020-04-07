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
  console.log('p2 then then value', );
}, err => {

})