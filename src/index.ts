import { Plugin } from 'vite';
import { getRoutesFromDir } from './utils';

import { defaultOptions, setOptions } from './options';

import { RouteObject, UserOptions } from './types';

export default function lazyPages(options: UserOptions = defaultOptions): Plugin {
  const virtualModuleId = 'virtual:lazy-pages';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'vite-plugin-lazy-pages',
    enforce: 'pre',
    configResolved () {
      setOptions(options, true);
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
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