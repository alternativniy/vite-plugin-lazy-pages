import { Plugin } from 'vite';

import { getRoutesFromDir } from './utils';
import { defaultOptions, setOptions } from './options';
import configureServer from './server';
import { VIRTUAL_MODULE_ID, RESOLVED_VIRTUAL_MODULE_ID } from './constants';

import { RouteObject, UserOptions } from './types';

export default function lazyPages(options: UserOptions = defaultOptions): Plugin {
  return {
    name: 'vite-plugin-lazy-pages',
    enforce: 'pre',
    configResolved () {
      setOptions(options, true);
    },
    configureServer,
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },
    async load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const { pages } = options;
        let routes: RouteObject[] = [];

        for (const page of pages) {
          const dirRoutes = await getRoutesFromDir(page);

          routes = [...routes, ...dirRoutes];
        }

        return `export default ${JSON.stringify(routes, null, 2).replace(/("##)|(##")/gm, '')}`;
      }
    },
  }
}