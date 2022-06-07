import { ShapeFlags } from '../share/shapeFlags'

export const initSlots = (instance: any, children: any) => {
  // instance.slots = Array.isArray(children) ? children : [children]
  const { vnode } = instance
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }
}

const normalizeObjectSlots = (children, slots) => {
  for (const key in children) {
    const value = children[key]
    slots[key] = (props) => normalizeSlotValue(value(props))
  }
}

export const normalizeSlotValue = (value) => {
  return Array.isArray(value) ? value : [value]
}
