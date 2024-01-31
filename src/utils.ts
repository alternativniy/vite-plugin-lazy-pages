import { normalizePath } from "vite";
import { readdirSync, existsSync, Dirent } from "fs";
import { resolve, join } from "path";

import { getOptions } from "./options";

import { RouteObject } from "./types";

const __root = normalizePath(process.cwd());

const defaultExport = (path: string) =>
  `##async () => {const { default: Component, ...other } = await import('${path}');return { Component, ...other };}##`;
const namedExport = (path: string) => `##() => import('${path}')##`;

export const getRoutesFromDir = async ({
  dir,
  filePattern,
  parentRoute,
}: {
  dir: string;
  filePattern: RegExp;
  parentRoute?: RouteObject;
}): Promise<RouteObject[]> => {
  const routes: RouteObject[] = [];
  const resolvedPath = resolve(__root, dir);
  const { exclude } = getOptions();

  if (existsSync(resolvedPath)) {
    const checkInExclude = (path: string) =>
      exclude.some((excludePath) =>
        path.includes(resolve(__root, excludePath))
      );
    const structure = readdirSync(resolvedPath, { withFileTypes: true }).filter(
      (file) =>
        !checkInExclude(file.path) &&
        (file.isDirectory() || (file.isFile() && filePattern.test(file.name)))
    );

    for (const file of structure) {
      if (file.isDirectory()) {
        const route = await createLayout(file);

        route.children = await getRoutesFromDir({
          dir: join(file.path, file.name),
          filePattern,
          parentRoute: route,
        });

        route.handle = {
          ...(route.handle ?? {}),
          pattern: createRoutePattern(route, parentRoute),
        };

        if (route.children.length > 0) {
          routes.push(route);
        }
      } else {
        const route = await createRoute(file);

        route.handle = {
          ...(route.handle ?? {}),
          pattern: createRoutePattern(route, parentRoute),
        };

        routes.push(route);
      }
    }
  }

  return routes.filter((route) => route);
};

export const createRoute = async (file: Dirent): Promise<RouteObject> => {
  const { extendRoute, exportMode } = getOptions();

  const isIndex = file.name.startsWith("index");
  let correctPath = file.name
    .replace("index", "")
    .split(".")[0]
    .replace(/[^a-zA-Z0-9]/g, "");
  const IMPORT_PATH = join(file.path, file.name).replace(__root, "");

  if (file.name.startsWith("[")) {
    correctPath = `:${correctPath}`;
  }

  let route: RouteObject = {
    file,
    path: isIndex ? "" : correctPath,
    index: isIndex,
    lazy:
      exportMode === "default"
        ? defaultExport(IMPORT_PATH)
        : namedExport(IMPORT_PATH),
  };

  if (extendRoute) {
    route = await extendRoute(route);
  }

  delete route.file;

  return route;
};

export const createLayout = async (file: Dirent): Promise<RouteObject> => {
  const { extendRoute } = getOptions();

  const correctPath = file.name.startsWith("[")
    ? `:${file.name.replace(/[^a-zA-Z0-9]/g, "")}`
    : file.name;

  let route: RouteObject = {
    file,
    path: correctPath,
  };

  if (extendRoute) {
    route = await extendRoute(route);
  }

  delete route.file;

  return route;
};

export const createRoutePattern = (
  route: RouteObject,
  parentRoute: RouteObject | undefined
): string => {
  const { path } = route;

  return parentRoute?.handle?.pattern
    ? `/${parentRoute.handle.pattern}/${path}`
    : `/${path}`;
};
