import { camelize, toHandlerKey } from '../share/index'

export const emit = (instance, event, ...args) => {
  const { props } = instance
  console.log('emit ' + event)

  // add => Add
  //  add-foo => addFoo

  const handlerName = toHandlerKey(camelize(event))
  const handler = props[handlerName]
  handler && handler(...args)
}
