import { ShapeFlags } from '../share/shapeFlags'
export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export const createVNode = (type, props?, children?) => {
  const vnode = {
    type,
    props,
    shapeFlag: getShapeFlag(type),
    children,
    el: null,
  }

  if (typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  // 判断children 是否是slot
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === 'object') {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
    }
  }

  return vnode
}

export const getShapeFlag = (type) => {
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}

export const createTextVNode = (text: string) => {
  return createVNode(Text, {}, text)
}
