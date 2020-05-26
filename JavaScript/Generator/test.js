function timeout(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function asyncPrint(value, ms) {
  console.log('in');
  await timeout(ms)
  console.log('out');
  console.log('value', value);
}

asyncPrint('hello', 2000)