import { createRenderer } from "../../lib/mini-vue.esm.js";

const renderer = createRenderer({
  createElement (type) {
    const rect = new PIXI.Graphics()
    rect.beginFill(0xff0000)
    rect.drawRect(0, 0, 100, 100)
    rect.endFill()
    return rect
  },
  patchProp (el, key, val) {
    el[key] = val
  },

  insert (el, parent) {
    parent.addChild(el)
  },
})

export const createApp = (rootComponent) => {
  return renderer.createApp(rootComponent)
};

