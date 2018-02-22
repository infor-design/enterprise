module.exports = {

  strip_code: {
    options: {
      start_comment: 'start-amd-strip-block',
      end_comment: 'end-amd-strip-block'
    },
    src: {
      src: 'temp/amd/*.js'
    }
  }

};
