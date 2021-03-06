import { createRenderer } from '../runtime-core'

export const createElement = (type) => {
  return document.createElement(type)
}
export const patchProp = (el, key, prevVal, nextVal) => {
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase()
    el.addEventListener(event, nextVal)
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, nextVal)
    }
  }
}
export const insert = (el, parent) => {
  parent.append(el)
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
})

export const createApp = (...arg) => {
  return renderer.createApp(...arg)
}

export * from '../runtime-core'
