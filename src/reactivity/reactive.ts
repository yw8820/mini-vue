import { track, trigger } from './effect'
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from './baseHandlers'
import { isObject } from '../share/index'

export const enum ReactiveFlags {
  IS_REACTIVE = '__V_isReactive',
  IS_READONLY = '__V_isReadonly',
}

export const reactive = (raw) => {
  return createActiveObject(raw, mutableHandlers)
}

export const readonly = (raw) => {
  return createActiveObject(raw, readonlyHandlers)
}

export const shallowReadonly = (raw) => {
  return createActiveObject(raw, shallowReadonlyHandlers)
}

function createActiveObject(raw: any, baseHandlers) {
  if (!isObject(raw)) {
    console.warn(`target${raw}必须是一个对象`)
    return raw
  }
  return new Proxy(raw, baseHandlers)
}
export const isReactive = (value) => {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export const isReadonly = (value) => {
  return !!value[ReactiveFlags.IS_READONLY]
}

export const isProxy = (value) => {
  return isReactive(value) || isReadonly(value)
}
