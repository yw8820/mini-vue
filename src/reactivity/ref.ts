import { hasChanged, isObject } from '../share'
import { isTracking, trackeffect, triggerEffect } from './effect'
import { reactive } from './reactive'

class RefImpl {
  private _rawValue: any
  private _value: any
  private dep
  public __v_isRef = true

  constructor(value) {
    this._rawValue = value
    this._value = covert(value)
    this.dep = new Set()
  }
  get value() {
    trackRefValue(this)
    return this._value
  }
  set value(newvalue) {
    if (hasChanged(newvalue, this._rawValue)) {
      this._rawValue = newvalue
      this._value = covert(newvalue)
      triggerEffect(this)
    }
  }
}

const covert = (value) => {
  return isObject(value) ? reactive(value) : value
}

export const trackRefValue = (ref) => {
  if (isTracking()) {
    trackeffect(ref.dep)
  }
}

export const ref = (value) => {
  return new RefImpl(value)
}

export const isRef = (ref) => {
  return !!ref.__v_isRef
}

export const unRef = (ref) => {
  return isRef(ref) ? ref.value : ref
}

export const proxyRefs = (objectwithRefs) => {
  return new Proxy(objectwithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value)
      } else {
        return Reflect.set(target, key, value)
      }
    },
  })
}
