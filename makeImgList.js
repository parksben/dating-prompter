const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'build');
const IMG_DIR = path.resolve(__dirname, 'build/static/media');

const imgList = fs
  .readdirSync(IMG_DIR)
  .filter((x) => /\.(png|jpg|jpeg|svg|webp|gif)$/.test(x))
  .map((x) => path.resolve('/static/media/', x));

const jsFileContent = `var imgList = ${JSON.stringify(imgList)};`;

fs.writeFileSync(
  path.resolve(BUILD_DIR, 'initImgList.js'),
  jsFileContent,
  'utf8'
);
