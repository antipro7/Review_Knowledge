async function f() {
  await Promise.resolve('1')
}

f().then(v => console.log('v', v))