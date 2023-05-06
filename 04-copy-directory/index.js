const fs = require('fs/promises');
const path = require('path');
const oldPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

async function copyFiles() {
  try {
    await fs.rm(copyPath, {
      recursive: true,
      force: true,
    });
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
  await fs.mkdir(copyPath, { recursive: true });

  const files = await fs.readdir(oldPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const oldFilePath = path.join(oldPath, file.name);
      const copyFilePath = path.join(copyPath, file.name);
      await fs.copyFile(oldFilePath, copyFilePath);
    }
  }
}
copyFiles();

