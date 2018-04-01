// @flow

type Result<T> =
  | {| value: T, done: false |}
  | {| value: void, done: true |}

// $FlowFixMe
export default class PushableAsyncIterator<T> implements AsyncIterator<T> {
  _running: boolean = true
  _pullQueue: Array<(Result<T>) => any> = []
  _pushQueue: Array<T> = []

  pushValue(event: T) {
    if (this._pullQueue.length !== 0) {
      this._pullQueue.shift()({value: event, done: false})
    } else {
      this._pushQueue.push(event)
    }
  }

  _pullValue(): Promise<Result<T>> {
    return new Promise((resolve: (result: Result<T>) => any) => {
      if (this._pushQueue.length !== 0) {
        resolve({value: this._pushQueue.shift(), done: false})
      } else {
        this._pullQueue.push(resolve)
      }
    })
  }

  _emptyQueue() {
    if (this._running) {
      this._running = false
      this._pullQueue.forEach(resolve => resolve({value: undefined, done: true}))
      this._pullQueue.length = 0
      this._pushQueue.length = 0
    }
  }

  next(): Promise<Result<T>> {
    return this._running ? this._pullValue() : this.return()
  }
  return(): Promise<Result<T>> {
    this._emptyQueue()
    return Promise.resolve({value: undefined, done: true})
  }
  throw(error: Error): Promise<any> {
    this._emptyQueue()
    return Promise.reject(error)
  }
}

