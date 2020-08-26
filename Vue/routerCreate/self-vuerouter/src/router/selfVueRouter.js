class VueRouter {

}

let Vue = null;

VueRouter.install = function (v) {
  Vue = v;
  console.log('Vue', Vue);

  const ifDef = v => v !== undefined;

  // 全局混入，给其他组件页注册这个 router
  // new Vue 时或者创建新组件时，在 beforeCreate 钩子中调用
  Vue.mixin({
    beforeCreate() {
      console.log('this.$options', this.$options);
      if (ifDef(this.$options.router)) { // 判断是否根组件，该对象只在根组件上存在
        this._root = this; // 那当前实例挂载到 _root 上
        this._router = this.$options.router; // VueRouter实例
      } else {
        this._root = this.$parent && this.$parent._root
      }

      // 所有实例中 this.$router 等同于 this._root._router
      Object.defineProperty(this, '$router', {
        get() {
          return this._root._router;
        }
      })
    },
  })

  Vue.component('router-link', {
    render(h) {
      return h('a', {}, '首页')
    }
  })
  Vue.component('router-view', {
    render(h) {
      return h('h1', {}, '首页视图')
    }
  })
}

export default VueRouter;

// 连接 https://juejin.im/post/6854573222231605256