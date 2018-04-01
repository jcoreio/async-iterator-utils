// @flow

import {$$asyncIterator} from 'iterall'

async function * concatHelper<T>(...iterables: Array<AsyncIterable<T>>): AsyncIterator<T> {
  for (let iterable of iterables) {
    for await (let value of iterable) {
      yield value
    }
  }
}

export default function concat<T>(...iterables: Array<AsyncIterable<T>>): AsyncIterable<T> {
  return {
    [$$asyncIterator]: () => concatHelper(...iterables)
  }
}
