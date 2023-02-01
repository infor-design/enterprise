/* eslint-disable no-console */
import { copyFile, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';

// Root Paths
const jsDir = 'dist/js';
const sassDir = 'dist/sass';
const rootDir = 'dist';
const svgDir = 'dist/svg';

// Recursively get files a directory
const getAllFiles = dir => readdirSync(dir).reduce((files, file) => {
  const name = join(dir, file);
  const isDirectory = statSync(name).isDirectory();

  return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
}, []);

// Copy From/To Recursively
const copyFiles = (sourceDir, ext, destDir, flatten) => {
  const files = getAllFiles(sourceDir).filter(fn => fn.endsWith(ext));

  files.forEach((file) => {
    const dest = flatten ? `${destDir}${basename(file)}` : `${destDir}${file}`;
    if (!existsSync(dirname(dest))) {
      mkdirSync(dirname(dest), { recursive: true });
    }
    // eslint-disable-next-line no-use-before-define
    copyFile(file, dest, callback);
  });
};

// Make directory if it doesn't exist
if (!existsSync(rootDir)) {
  mkdirSync(rootDir);
}
if (!existsSync(jsDir)) {
  mkdirSync(jsDir);
}
if (!existsSync(sassDir)) {
  mkdirSync(sassDir);
}
if (!existsSync(svgDir)) {
  mkdirSync(svgDir);
}

// Single Call back
const callback = (err) => {
  if (err) {
    console.error(err);
  }
};

// Do Copy
copyFile('node_modules/jquery/dist/jquery.js', `${jsDir}/jquery-3.6.1.js`, callback);
copyFile('node_modules/jquery/dist/jquery.min.js', `${jsDir}/jquery-3.6.1.min.js`, callback);
copyFile('node_modules/jquery/dist/jquery.min.map', `${jsDir}/jquery-3.6.1.min.map`, callback);
copyFile('node_modules/d3/dist/d3.js', `${jsDir}/d3.v7.js`, callback);
copyFile('node_modules/d3/dist/d3.min.js', `${jsDir}/d3.v7.min.js`, callback);
copyFiles('src', '.scss', 'dist/sass/');
copyFiles('src/components/locale/cultures', '.js', 'dist/js/cultures/', true);
copyFiles('src/components/emptymessage', '.html', 'dist/svg/', true);
copyFiles('src/components/icons', '.html', 'dist/svg/', true);
