const INPUT_FILENAME = 'dist/js/sohoxi.js';
const INPUT_SOURCEMAP = 'dist/js/sohoxi.js.map';
const OUTPUT_FILENAME = 'dist/js/sohoxi.min.js';
const OUTPUT_URL = 'sohoxi.min.js.map';
const OUTPUT_SOURCEMAP = `dist/js/${OUTPUT_URL}`;
const CULTURES_FOLDER = 'dist/js/cultures/';

export default {

  // Path of the `dist/` language cultures folder
  culturesFolder: CULTURES_FOLDER,

  // Path of the uncompressed, transpiled file
  inputFileName: INPUT_FILENAME,

  // Path of the uncompressed, transpiled file's sourcemap file
  inputSourceMapFileName: INPUT_SOURCEMAP,

  // Desired path of output file
  outputFileName: OUTPUT_FILENAME,

  // Desired path of output sourcemap file
  outputSourceMapFileName: OUTPUT_SOURCEMAP,

  // Terser Settings.
  // See [Terser docs](https://github.com/terser/terser) for info:
  // NOTE: Some Sourcemap-related settings are automatically handled in `../minify.js`
  terser: {
    sourceMap: false
  }
};
