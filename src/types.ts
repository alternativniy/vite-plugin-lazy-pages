import { Dirent } from 'fs'
import { LazyRouteFunction, RouteObject as RouteObjectLib } from "react-router-dom";

export type RouteObject = Omit<RouteObjectLib, 'lazy' | 'children'> & {
  lazy?: string | LazyRouteFunction<RouteObjectLib>;
  children?: RouteObject[];
  file?: Dirent;
}

export type Page = {
  dir: string;
  filePattern: RegExp;
}

export type UserOptions = {
  pages: Page[];
  exclude?: string[];
  extendRoute?: (route: RouteObject) => (RouteObject | Promise<RouteObject> );
  exportMode?: 'default' | 'named';
}