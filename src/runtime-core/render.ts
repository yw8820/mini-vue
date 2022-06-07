import { effect } from '../reactivity/effect'
import { EMPTY_OBJ, isObject } from '../share/index'
import { ShapeFlags } from '../share/shapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { createAppApi } from './createApp'
import { Fragment, Text } from './vnode'

export const createRenderer = (options) => {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options

  const render = (vnode, container) => {
    // patch 方法
    patch(null, vnode, container, null)
  }

  const patch = (n1, n2, container, parentComponent) => {
    // 判断是不是组件 处理组件
    const { shapeFlag, type } = n2

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
    }

    // 判断是不是element 类型
  }

  const processText = (n1, n2: any, container: any) => {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  const processFragment = (n1, n2: any, container: any, parentComponent) => {
    mountChildren(n2, container, parentComponent)
  }

  const processElement = (n1, n2: any, container: any, parentComponent) => {
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container)
    }
  }

  const patchElement = (n1, n2, container: any) => {
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)
    debugger
    patchProps(el, oldProps, newProps)
  }

  const patchProps = (el, oldProps, newProps) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]

        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp)
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }

  const processComponent = (n1, n2: any, container, parentComponent) => {
    mountComponent(n2, container, parentComponent)
  }
  const mountComponent = (
    initinalVnode: any,
    container: any,
    parentComponent
  ) => {
    const instance = createComponentInstance(initinalVnode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initinalVnode, container)
  }
  const setupRenderEffect = (instance: any, initinalVnode, container) => {
    effect(() => {
      if (!instance.isMounted) {
        // 初始化
        console.log('init')
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
        patch(null, subTree, container, instance)
        initinalVnode.el = subTree.el
        instance.isMounted = true
      } else {
        console.log('update') // 更新
        const { proxy } = instance
        const prevSubTree = instance.subTree
        const subTree = instance.render.call(proxy)
        instance.subTree = subTree
        patch(prevSubTree, subTree, container, instance)
      }
    })
  }
  const mountElement = (vnode: any, container: any, parentComponent) => {
    const { children, props, shapeFlag } = vnode
    const el = (vnode.el = hostCreateElement(vnode.type))
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent)
    }

    for (const key in props) {
      const val = props[key]
      // const isOn = (key: string) => /^on[A-Z]/.test(key)
      // if (isOn(key)) {
      //   const event = key.slice(2).toLowerCase()
      //   el.addEventListener('click', val)
      // } else {
      //   el.setAttribute(key, val)
      // }
      hostPatchProp(el, key, null, val)
    }
    // container.append(el)
    hostInsert(el, container)
  }
  const mountChildren = (vnode: any, container: any, parentComponent) => {
    vnode.children.forEach((v) => {
      patch(null, v, container, parentComponent)
    })
  }

  return {
    createApp: createAppApi(render),
  }
}
