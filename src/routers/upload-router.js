var path = require('path'),
    multer = require('multer');
module.exports = function(app) {

  app.use(multer({
    dest: path.join(__dirname, 'uploads'),
    limits: {
      fields: 20,
      fileSize: 1024 * 1024,
      fileNameSize: 100,
      parts: 25,
      rename: function(fieldname, filename) {
        return filename + Date.now();
      },
      onFileUploadStart: function(file) {

      },
      onFileUploadData: function(file, data) {

      },
      onFileUploadComplete: function(file) {

      },
      onError: function(error, next) {
        // do something here?
        next(error);
      },
      onFileSizeLimit: function(file) {
        // do something here?
      },
      onFieldsLimit: function() {
        // do something here?
      },
      onPartsLimit: function() {
        // do something here?
      }
    }
  }));

  app.post('/api/upload', function(req, res) {
    console.log('upload');
  });

};
