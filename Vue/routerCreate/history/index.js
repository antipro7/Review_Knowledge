// 就是不支持file://这样的协议，必须是http(s)://这样的协议
// 报错 Uncaught DOMException: Failed to execute 'pushState' on 'History': A history state object with URL 'file:///C:/page1' cannot be created in a document with origin 'null' and URL ...

class RouterClass {
  constructor(path) {
    this.routes = {}; // 记录路径标识符对应的cb
    this.routes[path] && this.routes[path]();
    window.history.replaceState({foo: 'bar'}, null, path);
    window.addEventListener('popstate', e => {
      console.log(e, ' --- e')
      const path = e.state && e.state.path
      this.routes[path] && this.routes[path]()
    });

    if (path && path.length > 1) {
      path.forEach(item.path, () => {
        document.getElementById('app').innerHTML = item.component;
      });
    }
  }

  /**
   * 记录path对应cb
   * @param path 路径
   * @param cb 回调
   */
  route(path, cb) {
    this.routes[path] = cb || function() {}
  }
  
  /**
   * 触发路由对应回调
   * @param path
   */
  go(path) {
    console.log('path', path);
    window.history.pushState({foo: 'bar'}, null, path)
    this.routes[path] && this.routes[path]()
  }
}                                                                                                                                                                                                                                                              


let Router = new RouterClass()
const ul = document.querySelector('ul')
const ContentDom = document.querySelector('.app')
const changeContent = content => ContentDom.innerHTML = content

Router.route('/', () => changeContent('默认页面'))
Router.route('/page1', () => changeContent('page1页面'))
Router.route('/page2', () => changeContent('page2页面'))

ul.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    Router.go(e.target.getAttribute('data-path'));
  }
})
