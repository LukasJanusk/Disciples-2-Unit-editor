const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { app, BrowserWindow } = require('electron');

const HOST = '127.0.0.1';
let backendProcess = null;
let backendPort = 8000;

function getWindowIconPath() {
  return path.join(__dirname, 'assets', 'iconset', 'icon_256x256.png');
}

function getBackendExecutableName() {
  return process.platform === 'win32'
    ? 'disciples2-unit-editor-backend.exe'
    : 'disciples2-unit-editor-backend';
}

function getPackagedBackendCommand() {
  const executableName = getBackendExecutableName();
  return path.join(
    process.resourcesPath,
    'backend',
    'disciples2-unit-editor-backend',
    executableName,
  );
}

function getDevBackendCommand() {
  if (process.platform === 'win32') {
    return path.join(app.getAppPath(), '.venv', 'Scripts', 'python.exe');
  }
  return path.join(app.getAppPath(), '.venv', 'bin', 'python');
}

function getBackendLaunchArgs() {
  if (app.isPackaged) {
    return [];
  }
  return ['-m', 'server.main'];
}

function waitForBackendReady(port, timeoutMs = 15000) {
  const startedAt = Date.now();
  const healthUrl = `http://${HOST}:${port}/files/exist`;

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const request = http.get(healthUrl, response => {
        response.resume();
        if (response.statusCode && response.statusCode < 500) {
          resolve();
          return;
        }
        retry();
      });

      request.on('error', retry);
      request.setTimeout(2000, () => {
        request.destroy();
        retry();
      });
    };

    const retry = () => {
      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error(`Backend did not start within ${timeoutMs}ms`));
        return;
      }
      setTimeout(attempt, 250);
    };

    attempt();
  });
}

function findFreePort(startPort = 8000) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(startPort, HOST, () => {
      const address = server.address();
      if (
        typeof address === 'object' &&
        address &&
        typeof address.port === 'number'
      ) {
        const { port } = address;
        server.close(() => resolve(port));
        return;
      }
      server.close(() =>
        reject(new Error('Failed to resolve a free backend port')),
      );
    });
  });
}

async function startBackend() {
  backendPort = Number(process.env.APP_PORT) || (await findFreePort());

  const command = app.isPackaged
    ? getPackagedBackendCommand()
    : getDevBackendCommand();
  const args = getBackendLaunchArgs();
  const backendCwd = app.isPackaged ? process.resourcesPath : app.getAppPath();
  const hideBackendWindow = process.platform === 'win32' && app.isPackaged;
  const env = {
    ...process.env,
    APP_ENV: app.isPackaged ? 'prod' : process.env.APP_ENV || 'dev',
    APP_PORT: String(backendPort),
  };

  backendProcess = spawn(command, args, {
    cwd: backendCwd,
    env,
    stdio: hideBackendWindow ? 'ignore' : 'inherit',
    windowsHide: hideBackendWindow,
  });

  backendProcess.on('exit', code => {
    if (!app.isQuitting) {
      console.error(`Backend exited unexpectedly with code ${code}`);
    }
  });

  await waitForBackendReady(backendPort);
}

function createWindow() {
  const window = new BrowserWindow({
    icon: getWindowIconPath(),
    width: 1440,
    height: 960,
    minWidth: 1100,
    minHeight: 760,
    show: false,
    webPreferences: {
      additionalArguments: [`--app-port=${backendPort}`],
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  window.once('ready-to-show', () => {
    window.show();
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    window.loadURL(process.env.ELECTRON_RENDERER_URL);
    window.webContents.openDevTools({ mode: 'detach' });
    return;
  }

  window.loadFile(path.join(app.getAppPath(), 'client', 'dist', 'index.html'));
}

app.on('before-quit', () => {
  app.isQuitting = true;
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill();
  }
});

app.whenReady().then(async () => {
  try {
    await startBackend();
    createWindow();
  } catch (error) {
    console.error('Failed to start desktop application', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
