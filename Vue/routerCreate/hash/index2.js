// 具有历史记录的 hash 路由
/**
 * 可控制 Hash 路由的后退
 * 增加历史记录栈，暴露出后退函数
 * 问题：路由后退跳转的实现是对 location.hash 进行赋值。但是这样会引发重新引发 hashchange 事件，第二次进入 render 。
 * 所以我们需要增加一个标志位，来标明进入 render 方法是因为回退进入的还是用户跳转
 */

// 1 初始化一个路由
class HashRouter {
  constructor() {
    // 1 以键值对存储路由,url 与 回调函数对应
    this.routes = {};
    // 1 记录当前地址
    this.currentURL = '';
    this.isBack = false;
    // 4 hash 栈
    this.historyStack = [];
    // this.render = this.render.bind(this); // 修改 this 指向实例化，下面用箭头函数代替此步
    // 2 监听
    window.addEventListener('load', () => this.render(), false);
    window.addEventListener('hashchange', () => this.render(), false);
  }

  // 1 注册路由与回调函数
  route(path, cb) {
    this.routes[path] = cb || function () {};
  }

  // 3 执行当前路由回调，更新内容
  render() {
    if (this.isBack) {
      this.isBack = false;
      return
    }

    this.currentURL = window.location.hash.slice(1) || '/';
    this.historyStack.push(this.currentURL);
    this.routes[this.currentURL]();
  }

  // 4 路由后退函数
  back() {
    this.isBack = true;
    this.historyStack.pop();
    const length = this.historyStack.length;

    if (!length) return;
    let prev = this.historyStack[length - 1]; // 要回退的目标 hash
    
    window.location.hash = prev;
    this.currentURL = prev;
    this.routes[prev]();
  }
}

let app = document.getElementById('app');
let back = document.getElementById('back');
const Route = new HashRouter();

Route.route('/', () => {
  app.innerText = '首页'
})
Route.route('/page1', () => {
  app.innerText = 'page1'
})
Route.route('/page2', () => {
  app.innerText = 'page2'
})

back.addEventListener('click', () => {
  Route.back();
})

console.log('Route', Route);