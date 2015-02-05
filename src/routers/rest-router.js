var sampleDataCtrl = require('./../controllers/sample-data-controller'),
  _ = require('underscore'),
  _str = require('underscore.string');

module.exports = function(app) {

  function getErrorObj() {
    return {
      code: undefined,
      description: undefined
    }
  }
  function getRespObj() {
    return {
      errors: [],
      data: undefined
    }
  }

  app.get('/api/datagrid', function(req, res) {
    // validate
    var respObj = getRespObj();

    // col
    if (_.isUndefined(req.query.col) || _str.trim(req.query.col).length < 1) {
      var error = getErrorObj();
      error.description = 'querystring col sort must be a string.';
      respObj.errors.push(error);
    }
    if (_str.trim(req.query.col) !== 'none') {
      // sort
      if (req.query.sort !== '0' && req.query.sort !== '1') {
        var error = getErrorObj();
        error.description = 'querystring parameter sort must be an integer (0 or 1).';
        respObj.errors.push(error);
      }
    }
    // pg
    if (_.isUndefined(req.query.pg) || _str.trim(req.query.pg).length < 1 || parseInt(req.query.pg) < 1) {
      var error = getErrorObj();
      error.description = 'querystring pg sort must be an integer >= 1.';
      respObj.errors.push(error);
    }
    // recs
    if (_.isUndefined(req.query.recs) || _str.trim(req.query.recs).length < 1 || parseInt(req.query.recs) < 1) {
      var error = getErrorObj();
      error.description = 'querystring recs sort must be an integer >= 1.';
      respObj.errors.push(error);
    }

    sampleDataCtrl.getClient(function(err, clientObj) {
      if (err) {
        var error = getErrorObj();
        error.description = err.message;
        respObj.errors.push(error);

        res.header('content-type', 'application/json');
        res.send(500, JSON.stringify(respObj));
        return;
      }
      sampleDataCtrl.getGridData(
        clientObj.client,
        parseInt(req.query.pg),
        parseInt(req.query.recs),
        _str.trim(req.query.col),
        parseInt(req.query.sort),
        function(err1, data) {
          if (err1) {
            var error = getErrorObj();
            error.description = err1.message;
            respObj.errors.push(error);

            res.send(500, JSON.stringify(respObj));
            clientObj.done(clientObj.client);
            return;
          }
          var dataPayload = JSON.stringify(data);
          res.header('content-type', 'application/json');
          res.header('content-length', Buffer.byteLength(dataPayload));
          res.send(200, dataPayload);
          clientObj.done(clientObj.client);
          return;
        }
      );
    });
  });

  app.post('/api/datagrid', function(req, res) {
    var decimalErr = false;
    var intErr = false;

    // validate
    var respObj = getRespObj();

    // comment
    if (_.isUndefined(req.body.comment) || !_.isString(req.body.comment) || _str.trim(req.body.comment).length < 1 || _str.trim(req.body.comment).length > 500) {
      var error = getErrorObj();
      error.description = 'object attribute comment must be a string (1,500).';
      respObj.errors.push(error);
    }
    // decimal
    if (_.isUndefined(req.body.decimal)) {
      var error = getErrorObj();
      error.description = 'object attribute decimal must be a float.';
      respObj.errors.push(error);
      decimalErr = true;
    }
    try {
      var x = parseFloat(req.body.decimal);
    }
    catch(ex) {
      if (!decimalErr) {
        var error = getErrorObj();
        error.description = 'object attribute decimal must be a float.';
        respObj.errors.push(error);
      }
    }
    // int
    if (_.isUndefined(req.body.int)) {
      var error = getErrorObj();
      error.description = 'object attribute int must be an integer.';
      respObj.errors.push(error);
      intErr = true;
    }
    try {
      var x = parseInt(req.body.int);
    }
    catch(ex) {
      if (!intErr) {
        var error = getErrorObj();
        error.description = 'object attribute int must be an integer.';
        respObj.errors.push(error);
      }
    }
    // date
    if (_.isUndefined(req.body.date) || !_.isDate(new Date(req.body.date))) {
      var error = getErrorObj();
      error.description = 'object attribute date must be a UTC formatted string.';
      respObj.errors.push(error);
    }
    // bool
    if (_.isUndefined(req.body.bool) || !_.isBoolean(Boolean(req.body.bool))) {
      var error = getErrorObj();
      error.description = 'object attribute date must be a boolean.';
      respObj.errors.push(error);
    }
    // cntry_value
    if (_.isUndefined(req.body.cntry_value) || !_.isString(req.body.cntry_value) || _str.trim(req.body.cntry_value).length < 1 || _str.trim(req.body.cntry_value).length > 30) {
      var error = getErrorObj();
      error.description = 'object attribute cntry_value must be a string (1, 30).';
      respObj.errors.push(error);
    }

    sampleDataCtrl.getClient(function(err, clientObj) {
      if (err) {
        var error = getErrorObj();
        error.description = err.message;
        respObj.errors.push(error);

        res.header('content-type', 'application/json');
        res.send(500, JSON.stringify(respObj));
        return;
      }
      sampleDataCtrl.addDataGridRow(
        clientObj.client,
        {
          comment: _str.trim(req.body.comment),
          fractional_amount: parseFloat(req.body.decimal),
          integer_amount: parseInt(req.body.int),
          create_date: _str.trim(req.body.date),
          some_bool: _str.trim(req.body.bool),
          country: {
            value: _str.trim(req.body.cntry_value)
          }
        },
        function(err1, data) {
          if (err1) {
            var error = getErrorObj();
            error.description = err1.message;
            respObj.errors.push(error);

            res.send(500, JSON.stringify(respObj));
            clientObj.done(clientObj.client);
            return;
          }
          var dataPayload = JSON.stringify(data);
          res.header('content-type', 'application/json');
          res.header('content-length', Buffer.byteLength(dataPayload));
          res.send(200, dataPayload);

          clientObj.done(clientObj.client);
          return;
        }
      );
    });

  });

  app.delete('/api/datagrid', function(req, res) {
    var intErr = false;

    // validate
    var respObj = getRespObj();

    // id
    if (_.isUndefined(req.body.id)) {
      var error = getErrorObj();
      error.description = 'object attribute id must be an integer.';
      respObj.errors.push(error);
      intErr = true;
    }
    try {
      var x = parseInt(_str.trim(req.body.id));
    }
    catch(ex) {
      if (!intErr) {
        var error = getErrorObj();
        error.description = 'object attribute id must be an integer.';
        respObj.errors.push(error);
      }
    }

    sampleDataCtrl.getClient(function(err, clientObj) {
      if (err) {
        var error = getErrorObj();
        error.description = err.message;
        respObj.errors.push(error);

        res.header('content-type', 'application/json');
        res.send(500, JSON.stringify(respObj));
        return;
      }
      sampleDataCtrl.deleteGridRow(clientObj.client, _str.trim(req.body.id), function(err, data) {
        if (err) {
          var error = getErrorObj();
          error.description = err.message;
          respObj.errors.push(error);

          res.header('content-type', 'application/json');
          res.send(500, JSON.stringify(respObj));

          clientObj.done(clientObj.client);
          return;
        }
        res.header('content-type', 'application/json');
        res.send(200, {
          rowCount: data.rowCount
        });

        clientObj.done(clientObj.client);
        return;
      });
    });
  });

  app.get('/api/countries', function(req, res) {
    sampleDataCtrl.getClient(function(err, clientObj) {
      if (err) {
        var error = getErrorObj();
        error.description = err.message;
        respObj.errors.push(error);

        res.header('content-type', 'application/json');
        res.send(500, JSON.stringify(respObj));
        return;
      }
      sampleDataCtrl.getCountries(clientObj.client, function(err, data) {
        if (err) {
          var error = getErrorObj();
          error.description = err.message;
          respObj.errors.push(error);

          res.header('content-type', 'application/json');
          res.send(500, JSON.stringify(respObj));
          return;
        }

        var dataPayload = JSON.stringify(data.rows);
        res.header('content-type', 'application/json');
        res.header('content-length', Buffer.byteLength(dataPayload));
        res.send(200, dataPayload);

        clientObj.done(clientObj.client);
        return;
      });
    });
  });

}
