
# Keyv-cache 🚀

 A ~1kb `key/value` wrapper for the browser [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) with zero dependencies.

## Key Features

- ❌ Zero dependencies
- 📏 Less than 1kb in size
- 🤓 Easy to use API
- 🔒 Supports name-spacing for the separation of different parts of your application

## Installation

```bash

npm install keyv-cache

```

## Usage

```js

import KeyvCache from 'keyv-cache';
const cache = new KeyvCache({namespace:  'my-app'});

// within an async function
const  ONE_HOUR  =  60  *  60  *  1000;
await cache.set('foo', 'bar', ONE_HOUR)

// somewhere/sometime later
const  value  =  await cache.get('foo')
```

## API

To create a new KeyvCache instance:

```js
KeyvCache(options)
```

### options: { namespace: string }

An object that can contain the following options:

**🔑 namespace**: The cache name creates unique cache storage spaces.

### cache object

The object returned by KeyvCache for a specified namespace has the following methods:

#### set(key: string, value: any, ttl: number) => Promise<void>

Sets the value for the given key in a cache namespace. The value will be invalidated and deleted from the cache after the specified time-to-live (TTL).

**🔑 key**: The key to set in a cache namespace.

**value**: This is any value that can be serialized into a string.

**⏳ ttl**: The time-to-live for the cache entry in milliseconds.

#### get(key: string) => Promise<any>

Retrieves the value for the given key from a cache namespace. Return `null` if the key does not exist, or the entry is expired.

**key**: The key to retrieve from the cache.

#### has(key: string) => Promise<boolean>

Checks if the given key exists in a cache namespace.

**key**: The key to check for in the cache.

#### remove(key: string) => Promise<void>

Removes the given key from a cache namespace.

**key**: The key to remove from the cache.

#### removePattern(pattern: string) => Promise<void>

Removes all keys from a cache namespace that match the given pattern.

**pattern**: The string to match against the keys in the cache. Support for regex patterns is coming soon.

#### keys() => Promise<string[]>

Retrieves all keys from a cache namespace.

#### clear() => Promise<void>

Removes all keys from a cache namespace.
