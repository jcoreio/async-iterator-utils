// @flow

export default function concat<T>(...iterables: Array<AsyncIterable<T>>): AsyncIterable<T> {
  async function * concatAsyncIterator(): AsyncIterator<T> {
    for (let iterable of iterables) {
      for await (let value of iterable) {
        yield value
      }
    }
  }

  return ({
    [Symbol.asyncIterator]: concatAsyncIterator,
  }: any)
}
