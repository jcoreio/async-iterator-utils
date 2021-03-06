// @flow

import {describe, it} from 'mocha'
import {expect} from 'chai'

import {concat} from '../src'

describe('concat', () => {
  it('works', async () => {
    async function * range(begin: number, end: number): AsyncIterator<number> {
      for (let i = begin; i < end; i++) {
        yield i
      }
    }

    const concatenated = concat(
      // $FlowFixMe
      {[Symbol.asyncIterator]: () => range(0, 3)},
      // $FlowFixMe
      {[Symbol.asyncIterator]: () => range(3, 6)},
    )

    const result = []
    for await (let i of concatenated) {
      result.push(i)
    }
    expect(result).to.deep.equal([0, 1, 2, 3, 4, 5])
  })
})
