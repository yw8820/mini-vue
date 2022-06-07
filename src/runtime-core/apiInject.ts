import { getCurrentInstance } from './component'

export const provide = (key, value) => {
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    // const { provides } = currentInstance
    // provides[key] = value
    let { provides } = currentInstance
    const parentProvides = currentInstance.parent.provides
    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(parentProvides)
    }
    provides[key] = value
  }
}
export const inject = (key, defaultValue) => {
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides

    if (key in parentProvides) {
      return parentProvides[key]
    } else if (defaultValue) {
      return defaultValue
    }
  }
}
