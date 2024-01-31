# vite-plugin-lazy-pages

![NPM Version](https://img.shields.io/npm/v/vite-plugin-lazy-pages)


Simple file-based routing for Vite. Currently only [React Router](https://github.com/remix-run/react-router/) is supported, and only dynamic page import is supported. Static import is not envisioned or planned.

## Features
  * Only data routers support
  * Lazy loading routes by `lazy` property
  * Support data `loaders`, `actions` and `error-boundary`
  * Ignored routes per directory
  * Typescript support

## Getting started
**Install**:
```
npm install -D vite-plugin-lazy-pages
npm install react-router react-router-dom 
```

**Integrate**:
```js
// vite.config.js

import lazyPages from 'vite-plugin-lazy-pages'

export default {
  plugins: [
    lazyPages(),
  ],
}
```
```js
// main.js

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import routes from 'virtual:lazy-pages'

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider fallbackElement="router loading..." router={router} />
  </React.StrictMode>,
)
```

## Configuration
Pass your options to `lazyPages` function for customize:
```js
// vite.config.js

import lazyPages from 'vite-plugin-lazy-pages'

export default {
  plugins: [
    lazyPages({
      pages: [ { dir: 'src/pages', filePattern: /^.*\.(js|jsx|ts|tsx)$/ } ],
      exportMode: 'default',
      exclude [ 'src/pages/dev' ],
      extendRoute (route) => {
        if(!route.handle) {
          route.handle = {}
        }

        route.handle = { auth: true }

        return route;
      }
    }),
  ],
}
```

### pages
  * **Type**: `{ dir: string; filePattern: RegExp; }[]`
  * **Default**: `[ { dir: 'src/pages', filePattern: /^.*\.(js|jsx|ts|tsx)$/ } ]`

### exportMode
  * **Type**: `'default' | 'named'`
  * **Default**: `'default'`

Which component export you are using. `default` is the default export of the component. `named` - remix-like component export

### exclude
  * **Type**: `string[]`
  * **Default**: `[]`

At this time, only directory exclusion is supported

### extendRoute
  * **Type**: `(route: RouteObject) => (RouteObject | Promise<RouteObject>)`
  * **Default**: `undefined`

You can extend the route with this function. You can see an example above