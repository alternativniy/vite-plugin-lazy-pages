import { UserOptions } from "./types";

let userOptions: UserOptions;

export const defaultOptions: UserOptions = {
  pages: [ { dir: 'src/pages', filePattern: /^.*\.(js|jsx|ts|tsx)$/ } ],
  exportMode: 'default',
  exclude: [],
};

export const getOptions = (): UserOptions => {
  return userOptions;
}

export const setOptions = (options: UserOptions, initial = false) => {
  userOptions = initial ? { ...defaultOptions, ...options } : options;
}