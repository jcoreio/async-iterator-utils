// @flow

export default function addInitialValue<T>(initialValue: T, iterable: AsyncIterable<T>): AsyncIterable<T> {
  async function * addInitialValueAsyncIterator(): AsyncIterator<T> {
    yield initialValue
    for await (let value of iterable) {
      yield value
    }
  }

  return ({
    [Symbol.asyncIterator]: addInitialValueAsyncIterator
  }: any)
}

