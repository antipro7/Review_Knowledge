// promise 三种状态
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

// promise 接收一个函数参数，并且该函数会立即执行
function MyPromise(fn) {
  let _this = this;
  _this.state = PENDING;
  _this.value = undefined;

  // 用于保存 then 中的回调，只有当 promise 状态为 pending 时才会缓存，并且每个实例至多缓存一个
  _this.resolvedCallbacks = [];
  _this.rejectedCallbacks = [];

  _this.resolve = function (value) {
    if (value instanceof MyPromise) {
      // 如果 value 是个 Promise，递归执行
      return value.then(_this.resolve, _this.reject);
    }

    setTimeout(() => { // 异步执行，保证执行顺序
      if (_this.state === PENDING) {
        _this.state = RESOLVED;
        _this.value = value;
        _this.resolvedCallbacks.forEach(cb => cb());
      }
    })
  };

  _this.reject = function (reason) {
    setTimeout(() => { // 异步执行，保证执行顺序
      if (_this.state === PENDING) {
        _this.state = REJECTED;
        _this.value = reason;
        _this.rejectedCallbacks.forEach(cb => cb());
      }
    })
  };

  // 解决特殊情况 new Promise(() => throw Error('error'))
  try {
    fn(_this.resolve, _this.reject);
  } catch (e) {
    _this.reject(e);
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  var self = this;
  // then 必须返回一个新的 Promise
  var promise2;
  // onResolved 和 onRejected 都为可选参数
  // 如果类型不是函数需要忽略，同时也实现了透传
  // Promise.resolve(4).then().then((value) => console.log(value))
  onResolved = typeof onResolved === 'function' ? onResolved : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : r => { throw r };

  if (self.state === RESOLVED) {
    return (promise2 = new Promise(function (resolve, reject) {
      // 保证 onFulfilled，onRjected 异步执行,所以用了 setTimeout 包裹下
      setTimeout(() => {
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      })
    }))
  }

  if (self.state === REJECTED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      })
    }))
  }

  if (self.state === PENDING) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      self.resolvedCallbacks.push(function () {
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      })
    }))
  }
}

function resolutionProcedure (p2, x, resolve, reject) {
  // x 和 p2 不能相同，避免循环引用
  if (p2 === x) {
    return reject(new TypeError('Error'))
  }

  // 如果 x 为 promise,状态为 pending 需要继续等待，否则就执行
  if (x instanceof MyPromise) {
    if (x.state === PENDING) {
      x.then(value => {
        // 再次调用该函数是为了确认 x resolve 的参数是什么类型。
        // 如果是基本类型就再次 resolve ，把值传给下个 then
        resolutionProcedure(p2, value, resolve, reject);
      }, reject)
    } else {
      x.then(resolve, reject);
    }
    return;
  }

  // reject 或者 resolve 其中以恶搞执行过的话，忽略其他的
  let called = false
  // 判断 x 是否为对象或者函数
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 如果不能去除 then ,就 reject
    try {
      let then = x.then;
      // 如果 then 是函数，调用 x.then
      if (typeof then === 'function') {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolutionProcedure(p2, y, resolve, reject);
          },
          e => {
            if (called) return;
            called = true;
            reject(e);
          }
        );
      } else {
        resolve(e);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}