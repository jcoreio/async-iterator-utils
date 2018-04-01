// @flow

import {describe, it} from 'mocha'
import {expect} from 'chai'
import {$$asyncIterator} from 'iterall'

import {filter} from '../src'

describe('filter', () => {
  it('works with sync filter', async () => {
    async function * range(begin: number, end: number): AsyncIterator<number> {
      for (let i = begin; i < end; i++) {
        yield i
      }
    }

    const filtered = filter(
      {[$$asyncIterator]: () => range(0, 6)},
      (x: number) => x % 2
    )

    const result = []
    for await (let i of filtered) {
      result.push(i)
    }
    expect(result).to.deep.equal([1, 3, 5])
  })
  it('works with async filter', async () => {
    async function * range(begin: number, end: number): AsyncIterator<number> {
      for (let i = begin; i < end; i++) {
        yield i
      }
    }

    const filtered = filter(
      {[$$asyncIterator]: () => range(0, 6)},
      (x: number) => Promise.resolve(x % 2)
    )

    const result = []
    for await (let i of filtered) {
      result.push(i)
    }
    expect(result).to.deep.equal([1, 3, 5])
  })
})
