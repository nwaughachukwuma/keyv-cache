# Keyv-cache

A simple key/value cache wrapper for the browser cache-api.

## Installation

```bash
npm install keyv-cache
```

## Usage

```js
import KeyvCache from 'keyv-cache';

const cache = new KeyvCache();

// within an async function
await cache.set('foo', 'bar')

// somewhere/sometime later
const value = await cache.get('foo')
```
