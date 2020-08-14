// 实现 hash 路由
// 大致步骤
// 1. 注册路由
// 2. 监听路由变化
// 3. 页面不刷新情况下，更新内容
// 4. 前进后退

// 1 初始化一个路由
class HashRouter {
  constructor() {
    // 1 以键值对存储路由,url 与 回调函数对应
    this.routes = {};
    // 1 记录当前地址
    this.currentURL = '';
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
    this.currentURL = window.location.hash.slice(1) || '/';
    this.routes[this.currentURL]();
  }
}

let app = document.getElementById('app');
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

console.log('Route', Route);