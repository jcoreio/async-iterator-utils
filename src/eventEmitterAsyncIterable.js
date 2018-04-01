// @flow

import type EventEmitter from 'events'
import PushableAsyncIterator from './PushableAsyncIterator'

export default function eventEmitterAsyncIteratable<T>(
  eventEmitter: EventEmitter,
  eventsNames: string | string[]
): AsyncIterable<T> {
  type Next = {|value: T, done: false|} | {|value: void, done: true|}
  const eventsArray = typeof eventsNames === 'string' ? [eventsNames] : eventsNames

  function eventEmitterAsyncIterator(): AsyncIterator<T> {
    const iterator: PushableAsyncIterator<T> = new PushableAsyncIterator()

    function pushValue(event: T) {
      iterator.pushValue(event)
    }

    const addEventListeners = () => {
      for (const eventName of eventsArray) {
        eventEmitter.addListener(eventName, pushValue)
      }
    }

    const removeEventListeners = () => {
      for (const eventName of eventsArray) {
        eventEmitter.removeListener(eventName, pushValue)
      }
    }

    addEventListeners()

    // $FlowFixMe
    return {
      next(): Promise<Next> {
        return iterator.next()
      },
      return(): Promise<Next> {
        removeEventListeners()
        return iterator.return()
      },
      throw(error: Error): Promise<any> {
        removeEventListeners()
        return iterator.throw(error)
      },
    }
  }

  return ({
    // $FlowFixMe
    [Symbol.asyncIterator]: eventEmitterAsyncIterator,
  }: any)
}

