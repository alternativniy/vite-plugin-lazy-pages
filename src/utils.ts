import { readdirSync, existsSync, Dirent } from "fs";
import { resolve, join, extname } from "path";

import { getOptions } from "./options";
import { __ROOT } from "./constants";

import { RouteObject } from "./types";

const defaultExport = (path: string) =>
  `##async () => {const { default: Component, ...other } = await import('${path}');return { Component, ...other };}##`;
const namedExport = (path: string) => `##() => import('${path}')##`;

export const makeStructure = ({
  dir,
  filePattern,
}: {
  dir: string;
  filePattern: RegExp;
}) => {
  const { exclude } = getOptions();
  const resolvedPath = resolve(__ROOT, dir);

  const checkInExclude = (path: string) =>
    exclude?.some((excludePath) => path.includes(resolve(__ROOT, excludePath)));
  const structure = readdirSync(resolvedPath, { withFileTypes: true }).filter(
    (file) =>
      !checkInExclude(file.path) &&
      (file.isDirectory() || (file.isFile() && filePattern.test(file.name)))
  );

  return structure;
};

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
  const resolvedPath = resolve(__ROOT, dir);
  const { extendRoute } = getOptions();

  if (existsSync(resolvedPath)) {
    const structure = makeStructure({ dir, filePattern });

    for (const file of structure) {
      let route: RouteObject;

      if (file.isDirectory()) {
        route = await createLayout(file);

        route.children = await getRoutesFromDir({
          dir: join(file.path, file.name),
          filePattern,
          parentRoute: route,
        });
      } else {
        route = await createRoute(file);
      }
      
      if (route.lazy || (route.children && route.children?.length > 0)) {
        route.handle = {
          pattern: createRoutePattern(route, parentRoute),
        };

        if (extendRoute) {
          route = await extendRoute(route);
        }

        routes.push(route);
      }
    }
  }

  return routes;
};

export const createRoute = async (file: Dirent): Promise<RouteObject> => {
  const { exportMode } = getOptions();

  const isIndex = file.name.startsWith("index");
  const extension = extname(file.name);
  const nameRegex = new RegExp(`^(index)(\\${extension})`, "i");

  let correctPath = file.name
    .replace(/[^a-zA-Z0-9-.]/g, "")
    .replace(nameRegex, "$2")
    .replace(extension, "");
  const IMPORT_PATH = join(file.path, file.name).replace(__ROOT, "");

  if (file.name.startsWith("[")) {
    correctPath = `:${correctPath}`;
  }

  const route: RouteObject = {
    file,
    path: isIndex ? "" : correctPath,
    index: isIndex,
    lazy:
      exportMode === "default"
        ? defaultExport(IMPORT_PATH)
        : namedExport(IMPORT_PATH),
  };

  delete route.file;

  return route;
};

export const createLayout = async (file: Dirent): Promise<RouteObject> => {
  const correctPath = file.name.startsWith("[")
    ? `:${file.name.replace(/[^a-zA-Z0-9-.]/g, "")}`
    : file.name;

  const route: RouteObject = {
    file,
    path: correctPath,
  };

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
