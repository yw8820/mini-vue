import { h, ref } from '../../lib/guide-mini-vue.esm.js';
export const App = {
  name: 'App',
  setup () {
    const count = ref(0)
    const onClick = () => {
      count.value++
    }
    const props = ref({
      foo: 'foo',
      bar: 'bar'
    })
    const onChangePropDemo1 = () => {
      debugger
      props.foo.value = 'new-foo'
    }

    const onChangePropDemo2 = () => {
      debugger
      props.value.foo = undefined
    }

    const onChangePropDemo3 = () => {
      props.value = { foo: 'foo' }
    }
    return {
      count,
      props,
      onClick,
      onChangePropDemo1,
      onChangePropDemo2,
      onChangePropDemo3
    }
  },
  render () {

    return h('div', {
      id: 'root',
      ...this.props
    },
      [
        h('div', {}, 'count' + this.count),

        h('button', {
          onClick: this.onClick
        },
          'click'
        ),
        h('button', {
          onClick: this.onChangePropDemo1
        },
          'change props - 值改变了 - 修改'
        ),
        h('button', {
          onClick: this.onChangePropDemo2
        },
          'change props - 值变成了undefind - 删除'
        ),
        h('button', {
          onClick: this.onChangePropDemo3
        },
          'change props - key在新值里面没有了 - 删除'
        )
      ]
    )
  }
}

