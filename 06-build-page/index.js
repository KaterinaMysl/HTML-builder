const fs = require('fs');
const path = require('path');

const newFolder = path.join(__dirname, 'project-dist');
const components = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const newStylesPath = path.join(__dirname, 'project-dist', 'style.css');
const templatePath = path.join(__dirname, 'template.html');
const assetsPath = path.join(__dirname, 'assets');
const newAssetsPath = path.join(newFolder, 'assets');
const indexPath = path.join(newFolder, 'index.html');

async function buildProject() {
  try {
    await fs.promises.rm(newFolder, { recursive: true, force: true });
    await fs.promises.mkdir(newFolder, { recursive: true });
    await copyDir(assetsPath, newAssetsPath);
    await addStyles(path.join(newFolder, 'style.css'));
    await newHtml(templatePath, indexPath);
  } catch (err) {
    console.error(err);
  }
}

async function copyDir(assets, assetsDist) {
  await fs.promises.mkdir(assetsDist, { recursive: true });
  const files = await fs.promises.readdir(assets);

  for (const file of files) {
    const assetsChild = path.join(assets, file);
    const assetsDistChild = path.join(assetsDist, file);
    const stats = await fs.promises.stat(assetsChild);

    if (stats.isDirectory()) {
      await copyDir(assetsChild, assetsDistChild);
    } else {
      await fs.promises.copyFile(assetsChild, assetsDistChild);
    }
  }
}

async function addStyles() {
  const fileNames = await fs.promises.readdir(stylesPath, { withFileTypes: true });
  const writeStream = fs.createWriteStream(newStylesPath);

  for (const fileName of fileNames) {
    const ext = path.parse(fileName.name).ext;

    if (fileName.isFile() === true && ext === '.css') {
      const readStream = fs.createReadStream(path.join(stylesPath, fileName.name));

      readStream.on('data', data => writeStream.write(data + '\n'));
      readStream.on('error', error => console.log('Error', error.message));
    }
  }
}

async function newHtml(template, index) {
  let html = '';
  const templateReadStream = fs.createReadStream(template, { encoding: 'utf8' });

  for await (const chunk of templateReadStream) {
    html += chunk;
  }

  await addInfo(html, index);
}

async function addInfo(html, index) {
  const objHtml = {};
  const files = await fs.promises.readdir(components);
  let num = 0;

  for (const file of files) {
    const pathFile = path.join(components, file);
    const pathFileCont = file.replace(path.extname(file), '');
    objHtml[pathFileCont] = '';

    const readStream = fs.createReadStream(path.join(pathFile));
    readStream.on('data', (chunk) => {
      objHtml[pathFileCont] += chunk.toString();
    });
    readStream.on('end', () => {
      num++;
      if (num >= files.length) {
        for (const element in objHtml) {
          html = html.replace('{{' + element + '}}', objHtml[element]);
        }
        const htmlStream = fs.createWriteStream(index, { encoding: 'utf8' });
        htmlStream.write(html);
      }
    });
  }
}

buildProject();