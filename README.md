
# Keyv-cache 🚀

 A ~1kb `key/value` wrapper for the browser [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache), with zero-dependency.

## Key Features

- ❌ Zero dependencies
- 📏 Less than 1kb in size
- 🤓 Easy to use API
- 🔒 Supports namespaced caches for separation of different parts of your application

## Installation

```bash

npm install keyv-cache

```

## Usage

```js

import  KeyvCache  from  'keyv-cache';
const  cache  =  KeyvCache({namespace:  'my-app'});

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

**🔑 namespace**: The namespace to use for the cache. This can be used to separate different parts of your application into different caches.

### cache object

The object returned by KeyvCache has the following methods:

#### set(key: string, value: any, ttl: number) => Promise<void>

Sets the value for the given key in the cache. The value will be invalidated and deleted from the cache after the specified time-to-live (TTL) has passed.

**🔑 key**: The key to set in the cache.

**value**: The value to set for the given key. This can be any JavaScript value that can be serialized to a string.

**⏳ ttl**: The time-to-live for the cache entry, in milliseconds.

#### get(key: string) => Promise<any>

Retrieves the value for the given key from the cache. If the key does not exist or the entry has expired, null will be returned.

**key**: The key to retrieve from the cache.

#### has(key: string) => Promise<boolean>

Checks if the given key exists in the cache.

**key**: The key to check for in the cache.

#### remove(key: string) => Promise<void>

Removes the given key from the cache.

**key**: The key to remove from the cache.
