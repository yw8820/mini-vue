import { h } from '../../lib/guide-mini-vue.esm.js';
import { Foo } from './Foo.js';
window.self = null
export const App = {
  name: 'App',
  render () {
    window.self = this
    return h("div", {},
      [
        h('p', {}, 'hi' + 'app'),
        h(Foo, {
          onAdd (a, b) {
            console.log('onADDD', a, b);
          },
          onAddFoo () {
            console.log('onADDFOO');

          }
        }),
      ]
    )
  },
  setup () {
    return {
      msg: '哈哈哈哈'
    }
  }
};

