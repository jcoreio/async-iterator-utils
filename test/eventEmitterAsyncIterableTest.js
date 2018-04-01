// @flow

import EventEmitter from 'events'
import {describe, it} from 'mocha'
import {expect} from 'chai'

import {eventEmitterAsyncIterable} from '../src'

describe('eventEmitterAsyncIterable', () => {
  it('works', async () => {
    const emitter = new EventEmitter()
    const iterable = eventEmitterAsyncIterable(emitter, ['foo', 'bar'])
    const iterator = iterable[Symbol.asyncIterator]()
    const assertions = [
      async () => expect(await iterator.next()).to.deep.equal({value: 0, done: false}),
      async () => expect(await iterator.next()).to.deep.equal({value: 1, done: false}),
      async () => expect(await iterator.next()).to.deep.equal({value: 2, done: false}),
      async () => expect(await iterator.next()).to.deep.equal({value: 3, done: false}),
      async () => expect(await iterator.next()).to.deep.equal({value: 4, done: false}),
    ]

    emitter.emit('foo', 0)
    emitter.emit('bar', 1)
    const promises = assertions.map(assertion => assertion())
    emitter.emit('foo', 2)
    emitter.emit('bar', 3)
    emitter.emit('bar', 4)

    await Promise.all(promises)
    iterator.return()
    expect(emitter.listenerCount('foo')).to.equal(0)
    expect(emitter.listenerCount('bar')).to.equal(0)
  })
})
