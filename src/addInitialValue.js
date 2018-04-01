// @flow

import {$$asyncIterator} from 'iterall'

export default function addInitialValue<T>(initialValue: T, iterable: AsyncIterable<T>): AsyncIterable<T> {
  async function * addInitialValueAsyncIterator(): AsyncIterator<T> {
    yield initialValue
    for await (let value of iterable) {
      yield value
    }
  }

  return ({
    [$$asyncIterator]: addInitialValueAsyncIterator
  }: any)
}

