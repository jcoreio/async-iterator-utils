# @jcoreio/async-iterator-utils

[![Build Status](https://travis-ci.org/jcoreio/async-iterator-utils.svg?branch=master)](https://travis-ci.org/jcoreio/async-iterator-utils)
[![Coverage Status](https://codecov.io/gh/jcoreio/async-iterator-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/async-iterator-utils)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

utilities for working with ES7 async iterators

# Installation

```sh
npm install --save @jcoreio/async-iterator-utils
```

# Usage

## `addInitialValue`

```js
addInitialValue<T>(initialValue: T, iterable: AsyncIterable<T>): AsyncIterable<T>
```

Creates an `AsyncIterable` that yields `initialValue` followed by every value
in `iterable`.  Useful for yielding an initial value in GraphQL subscriptions.

## `concat`

```js
concat<T>(...iterables: Array<AsyncIterable<T>>): AsyncIterable<T>
```

Concatenates the results of the given `iterables` into a single `AsyncIterable`.

## `filter`

```js
filter<T>(iterable: AsyncIterable<T>, predicate: (T) => any): AsyncIterable<T>
```

Creates an `AsyncIterable` that only yields values from `iterable` for which
`predicate` returns/resolves to a truthy value.

## `eventEmitterAsyncIterable`

Adapted from `graphql-subscriptions`' `eventEmitterAsyncIterator`, but done properly
(it can't leave dangling listeners when used properly)

```js
eventEmitterAsyncIteratable<T>(
  eventEmitter: EventEmitter,
  eventsNames: string | string[]
): AsyncIterable<T>
```

Creates an `AsyncIterable` that yields all events with the given `eventsNames` that
are emitted by `eventEmitter`.
If you call its `Symbol.asyncIterator` method, be sure to eventually call `return`
or `throw` on the returned `AsyncIterator`, or you will leave dangling event listeners.

## `PushableAsyncIterator<T>`

An `AsyncIterator` class with an additional method:

### `pushValue(value: T)`

Enqueues `value`; the next call to `next()` will resolve to this `value`.

