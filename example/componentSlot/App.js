import { h, createTextVNode } from '../../lib/guide-mini-vue.esm.js';
import { Foo } from './Foo.js';
window.self = null
export const App = {
  name: 'App',
  render () {
    const app = h('p', {}, 'App')
    const foo = h(Foo, {},
      // [
      //   h("p", {}, '123'),
      //   h("p", {}, '456')
      // ]
      {
        header: ({ age }) => [h("p", {}, '123' + age), createTextVNode('你好呀')],
        footer: () => h("p", {}, '456')
      }
    )
    // const foo = h(Foo, {}, h("p", {}, '123'))
    return h('div', {}, [app, foo])
  },
  setup () {
    return {
      msg: '哈哈哈哈'
    }
  }
};

