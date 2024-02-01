import { ViteDevServer } from "vite";
import { resolve } from "path";
import { RESOLVED_VIRTUAL_MODULE_ID, __ROOT } from './constants'

import { getOptions } from "./options";

export default function configureServer(server: ViteDevServer) {
  server.watcher.on("unlink", (filePath) => {
    if (!isPagesFile(filePath)) return;

    restartServer(server);
  });

  server.watcher.on("add", (filePath) => {
    if (!isPagesFile(filePath)) return;

    restartServer(server);
  });
}

const isPagesFile = (filePath: string) => {
  const { pages } = getOptions();

  return pages.some(({ dir, filePattern }) => filePath.includes(resolve(__ROOT, dir)) && filePattern.test(filePath))
}

const restartServer = (server: ViteDevServer) => {
  const { moduleGraph } = server;
  const module = moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);

  if (module) {
    moduleGraph.invalidateModule(module);
  }

  server.ws.send({
    type: "full-reload",
  });
};
