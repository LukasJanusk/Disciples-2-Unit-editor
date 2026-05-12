const { contextBridge } = require("electron");

function getBackendPort() {
  const portArgument = process.argv.find((argument) => argument.startsWith("--app-port="));
  if (!portArgument) {
    return "8000";
  }

  return portArgument.slice("--app-port=".length) || "8000";
}

const backendPort = getBackendPort();

contextBridge.exposeInMainWorld("desktopConfig", {
  apiBaseUrl: `http://127.0.0.1:${backendPort}`,
});
