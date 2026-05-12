import { access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";

function getPythonExecutable() {
  if (process.env.BACKEND_PYTHON) {
    return process.env.BACKEND_PYTHON;
  }

  if (process.platform === "win32") {
    return path.join(process.cwd(), ".venv", "Scripts", "python.exe");
  }

  return path.join(process.cwd(), ".venv", "bin", "python");
}

async function ensurePythonExecutable(pythonExecutable) {
  await access(pythonExecutable, constants.X_OK);
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      cwd: process.cwd(),
      env: process.env,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`Command failed with exit code ${code}`));
    });
    child.on("error", reject);
  });
}

async function main() {
  const pythonExecutable = getPythonExecutable();
  await ensurePythonExecutable(pythonExecutable);

  await runCommand(pythonExecutable, [
    "-m",
    "PyInstaller",
    "--noconfirm",
    "--clean",
    "--onedir",
    "--name",
    "disciples2-unit-editor-backend",
    "--distpath",
    "dist/backend",
    "--workpath",
    ".pyinstaller/build",
    "--specpath",
    ".pyinstaller/spec",
    "--paths",
    process.cwd(),
    "server/main.py",
  ]);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
