import { extend } from '../share'
let activeEffect
let shouledTrack

export class ReactivityEffect {
  private _fn: any
  deps = []
  active = true
  onStop?: () => void
  public scheduler: Function | undefined
  constructor(fn, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    if (!this.active) {
      return this._fn()
    }

    shouledTrack = true
    activeEffect = this
    const result = this._fn()
    shouledTrack = false
    activeEffect = undefined
    return result
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

const targetMap = new Map()
export const track = (target, key) => {
  if (!isTracking()) return

  let depsMap = targetMap.get(key)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  trackeffect(dep)
}

export const trackeffect = (dep) => {
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export const triggerEffect = (deps) => {
  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export const isTracking = () => {
  return activeEffect && shouledTrack !== undefined
}

export const trigger = (target, key) => {
  let depsMap = targetMap.get(target)
  let deps = depsMap.get(key)
  triggerEffect(deps)
}

export const effect = (fn, options: any = {}) => {
  const _effect = new ReactivityEffect(fn, options.scheduler)
  extend(_effect, options)

  _effect.run()
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export const stop = (runner) => {
  runner.effect.stop()
}
