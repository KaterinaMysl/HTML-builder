const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const fileIn = path.parse(file);
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        const name = fileIn.name;
        const type = fileIn.ext.replace('.', '');
        const size = `${Number(stats.size / 1024).toFixed(2)}kb`;
        process.stdout.write(`${name} - ${type} - ${size}\n`);
      }
    });
  });
});