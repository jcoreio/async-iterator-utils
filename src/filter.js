// @flow

import {$$asyncIterator} from 'iterall'

export default function filter<T>(iterable: AsyncIterable<T>, predicate: (T) => any): AsyncIterable<T> {
  async function * filterAsyncIterator(): AsyncIterator<T> {
    for await (let value of iterable) {
      if (await predicate(value)) yield value
    }
  }

  return ({
    [$$asyncIterator]: filterAsyncIterator,
  }: any)
}
