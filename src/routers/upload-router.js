var path = require('path'),
    multer = require('multer'); // jshint ignore:line

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
      onError: function(error, next) {
        // do something here?
        next(error);
      }
    }
  }));

  app.post('/api/upload', function(req, res) {
    console.log(req, res);
  });

};
