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