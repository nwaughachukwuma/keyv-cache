
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

## 📖 Usage

```js

import KeyvCache from 'keyv-cache';
const cache = new KeyvCache({namespace:  'my-app'});

// within an async function
const ONE_HOUR = 60 * 60 * 1000;
await cache.set('foo', 'bar', ONE_HOUR)

// somewhere/sometime later
const value = await cache.get('foo')
```

## API

To create a new KeyvCache instance:

```js
KeyvCache(options)
```

### options: { namespace: string }

An object that can contain the following options:

**🔑 namespace**: The cache name to create a unique storage space.

### cache object

The object returned by KeyvCache for a specified namespace has the following methods:

#### set(key: string, value: any, ttl: number) => Promise<void>

> Stored value will be invalidated and deleted from the cache after the specified time-to-live (TTL).
> **🔑 key**: The key to set in a cache namespace.
> **📦 value**: This is any value that can be serialized into a string.
> **⏳ ttl**: The time-to-live for the cache entry in milliseconds.

#### get(key: string) => Promise<any>

> Returns `null` if the key does not exist, or the entry is expired.
> **key**: The key to retrieve from the cache.

#### has(key: string) => Promise<boolean>

> **key**: The key to check for.

#### remove(key: string) => Promise<void>

> **key**: The key to remove.

#### removePattern(pattern: string) => Promise<void>

> Removes all keys from a cache namespace matching the pattern.
> **pattern**: The string to match against the keys in the cache. Support for regex patterns is coming soon.

#### keys() => Promise<string[]>

#### clear() => Promise<void>

> Removes all keys from a cache namespace.
