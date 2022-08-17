import { copyFile, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

// Root Paths
const jsDir = 'dist/js';
const sassDir = 'dist/sass';
const rootDir = 'dist';

// Recursively get files a directory
const getAllFiles = dir =>
  readdirSync(dir).reduce((files, file) => {
    const name = join(dir, file);
    const isDirectory = statSync(name).isDirectory();
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
  }, []);

// Copy From/To Recursively
const copyFiles = (sourceDir, ext, destDir) => {
  const files = getAllFiles(sourceDir).filter(fn => fn.endsWith(ext));
  files.forEach(file => {
    const dest = `${destDir}${file}`;
    if (!existsSync(dirname(dest))) {
      mkdirSync(dirname(dest), { recursive: true });
    }
    copyFile(file, `${destDir}${file}`, callback);
  });
};

// Make directory if it doesn't exist
if (!existsSync(rootDir)){
  mkdirSync(rootDir);
}
if (!existsSync(jsDir)){
  mkdirSync(jsDir);
}
if (!existsSync(sassDir)){
  mkdirSync(sassDir);
}

// Single Call back
const callback = (err) => {
  if (err) {
    console.error(err);
  }
};

// Do Copy
copyFile('node_modules/jquery/dist/jquery.js', `${jsDir}/jquery-3.6.0.js`, callback);
copyFile('node_modules/jquery/dist/jquery.min.js', `${jsDir}/jquery-3.6.0.min.js`, callback);
copyFile('node_modules/jquery/dist/jquery.min.map', `${jsDir}/jquery-3.6.0.min.map`, callback);
copyFile('node_modules/d3/dist/d3.js', `${jsDir}/d3.v5.js`, callback);
copyFile('node_modules/d3/dist/d3.min.js', `${jsDir}/d3.v5.min.js`, callback);

copyFiles('src', '.scss', 'dist/sass/');
copyFiles('src/components/locale/cultures', '.js', 'dist/js/cultures/');
copyFiles('src/components/emptymessage', '*svg-empty.html', 'dist/svg/');
copyFiles('src/components/charts', 'svg-patterns.html', 'dist/svg/');
copyFiles('src/components/icons', '*svg.html', 'dist/svg/');

// { expand: true, flatten: true, src: ['src/components/locale/cultures/*.*'], dest: 'dist/js/cultures/', filter: 'isFile' },
// { expand: true, flatten: true, src: ['src/components/emptymessage/*svg-empty.html'], dest: 'dist/svg/', filter: 'isFile' },
// { expand: true, flatten: true, src: ['src/components/charts/svg-patterns.html'], dest: 'dist/svg/', filter: 'isFile' },
// { expand: true, flatten: true, src: ['src/components/icons/*svg.html'], dest: 'dist/svg/', filter: 'isFile' },
