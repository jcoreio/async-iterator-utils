// @flow

import type EventEmitter from 'events'

export default function eventEmitterAsyncIteratable<T>(
  eventEmitter: EventEmitter,
  eventsNames: string | string[]
): AsyncIterable<T> {
  type Next = {|value: T, done: false|} | {|value: void, done: true|}

  function eventEmitterAsyncIterator(): AsyncIterator<T> {
    const pullQueue = []
    const pushQueue = []
    const eventsArray = typeof eventsNames === 'string' ? [eventsNames] : eventsNames
    let listening = true

    const pushValue = (event: T) => {
      if (pullQueue.length !== 0) {
        pullQueue.shift()({value: event, done: false})
      } else {
        pushQueue.push(event)
      }
    }

    const pullValue = () => {
      return new Promise((resolve: (Next) => any) => {
        if (pushQueue.length !== 0) {
          resolve({value: pushQueue.shift(), done: false})
        } else {
          pullQueue.push(resolve)
        }
      })
    }

    const emptyQueue = () => {
      if (listening) {
        listening = false
        removeEventListeners()
        pullQueue.forEach(resolve => resolve({value: undefined, done: true}))
        pullQueue.length = 0
        pushQueue.length = 0
      }
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
        return listening ? pullValue() : this.return()
      },
      return(): Promise<Next> {
        emptyQueue()

        return Promise.resolve({value: undefined, done: true})
      },
      throw(error: Error): Promise<any> {
        emptyQueue()

        return Promise.reject(error)
      },
    }
  }

  return ({
    // $FlowFixMe
    [Symbol.asyncIterator]: eventEmitterAsyncIterator(),
  }: any)
}

