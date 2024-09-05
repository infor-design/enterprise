import * as fs from 'fs';
import * as path from 'path';

const fsFiles = (dirPath = './', fileType = '', fileOptions = []) => {
  // Return Files array
  const files = fs.readdirSync(dirPath);
  // Loop through files array
  files.forEach((file) => {
    // File options is an array then push items in.
    const arrPush = () => fileOptions.push(path.join(dirPath, '/', file));
    // File options is an object assign key and set value.
    // eslint-disable-next-line no-return-assign
    const objAssign = () => fileOptions[path.join(file.split('.')[0])] = path.join(dirPath, '/', file);
    // Check if `${dirPath}/${file}` is a folder or a file
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      fileOptions = fsFiles(`${dirPath}/${file}`, fileType, fileOptions);
    } else {
      // Check if fileType is an empty string and return all files.
      if (fileType === '') {
        if (Array.isArray(fileOptions)) {
          arrPush();
        } else {
          objAssign();
        }
      }
      // Check for specific file type if fileType does not equal emplty string.
      if (file.substring(file.length - fileType.length, file.length) === fileType) {
        if (Array.isArray(fileOptions)) {
          arrPush();
        } else {
          objAssign();
        }
      }
    }
  });
  return fileOptions;
};

export default fsFiles;
