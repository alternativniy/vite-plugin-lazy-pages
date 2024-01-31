import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import lazyPages from './src'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), lazyPages({
    pages: [ { dir: 'example/pages', filePattern: /^.*\.(js|jsx|ts|tsx)$/ } ],
    exclude: ['example/pages/products/index'],
    extendRoute: (route) => {
      if(!route.handle) {
        route.handle = {}
      }

      route.handle.test = 'test';

      return route;
    }
  })],
})
