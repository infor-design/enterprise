module.exports = {

  strip_code: { // jshint ignore:line
    options: {
      start_comment: 'start-amd-strip-block', // jshint ignore:line
      end_comment: 'end-amd-strip-block' // jshint ignore:line
    },
    src: {
      src: 'temp/amd/*.js'
    }
  }

};
