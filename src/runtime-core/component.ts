import { proxyRefs } from '../reactivity'
import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import { initSlots } from './componentSlots'

export const createComponentInstance = (vnode: any, parent) => {
  // debugger
  console.log('createComponentInstance', parent)
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
    isMounted: false,
    emit: () => {},
  }

  component.emit = emit.bind(null, component) as any
  return component
}

export const setupComponent = (instance) => {
  // todo
  initProps(instance, instance.vnode.props)
  initSlots(instance, instance.vnode.children)

  setupStatefulComponent(instance)
}
const setupStatefulComponent = (instance: any) => {
  const Component = instance.type
  const { setup } = Component
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)
  if (setup) {
    setCurrentInstance(instance)
    const setupResult = setup(instance.props, {
      emit: instance.emit,
      // slots: instance.slots,
    })
    setCurrentInstance(null)
    handleSteupResult(instance, setupResult)
  }
}
const handleSteupResult = (instance, setupResult: any) => {
  //
  if (typeof setupResult === 'object') {
    instance.setupState = proxyRefs(setupResult)
  }

  finishComponentSetup(instance)
}
const finishComponentSetup = (instance: any) => {
  const Component = instance.type
  if (Component.render) {
    instance.render = Component.render
  }
}

let currentInstance = null
export const getCurrentInstance = () => {
  return currentInstance
}

export const setCurrentInstance = (instance) => {
  currentInstance = instance
}
