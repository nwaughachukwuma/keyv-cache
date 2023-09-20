# Keyv-cache 🚀

A tiny `key/value` wrapper for the browser [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) with zero dependencies. It provides a simple key-value interface with Time to Live (TTL) support.

## Key Features

- ✅ Less than 1kB - lightweight with zero dependencies
- 🚀 Super easy to use - intuitive API
- 🔒 Namespacing - isolate caches by namespace for your app
- 📦 Flexible values - cache any serializable value

## Installation

```bash

npm install keyv-cache

```

## 📖 Usage

```js
import KeyvCache from "keyv-cache";
const cache = KeyvCache({ namespace: "my-app" });

// within an async function
const ONE_HOUR = 60 * 60 * 1000;
await cache.set("foo", "bar", ONE_HOUR);

// somewhere/sometime later
const value = await cache.get("foo");
```

## API

To create a new KeyvCache instance:

```js
KeyvCache(options);
```

### options: { namespace: string }

An object that can contain the following options:

- **namespace**: The namespace for isolating caches

### cache methods

The object returned for a namespace has the following methods:

1. `set(key: string, value: any, ttl: number) => Promise<void>`

   - Set a key-value pair with a TTL in ms
   - **value**: any serializable primitive or object.

2. `get(key: string) => Promise<any>`

   - Get the value for a key; Returns `null` if the key does not exist, or is expired.

3. `has(key: string) => Promise<boolean>`

   - Check if a key exists.

4. `remove(key: string) => Promise<void>`

   - Remove a key from the cache.

5. `removePattern(pattern: string) => Promise<void>`

   - Removes all keys from a cache namespace matching the pattern. Support for regex patterns is coming soon.

6. `keys() => Promise<string[]>`

   - Returns an array of all keys in a cache namespace.

7. `clear() => Promise<void>`

   - Removes all keys from a cache namespace.

## ⚡ Performance

Keyv-cache uses the built-in and super fast Browser Cache API under the hood. This makes it ideal for caching data on the client-side without sacrificing performance.
The fallback memory cache is also very fast for environments where the Browser Cache API is not supported.

## 🏆 Contributing

We welcome contributions big and small! Please feel welcomed to send a PR or open an issue.

MIT © Chukwuma Nwaugha
