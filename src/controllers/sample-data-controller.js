var _pg = require('pg').native,
  _ = require('underscore'),
  _str = require('underscore.string');

module.exports = {

  /**
  * @function getClient
  * @description Retrieves a postgresql client object.
  * @param {Function} cb The callback function(err {Undefined|Object}, client {Undefined|Object}).
  * If a client object is returned, it takes the form of { client: {Object}, done: {function} }.
  */
  getClient: function getClient(cb) {
    var cn = 'pg://sampledatauser:sohoxi@localhost:5432/sohoxi';

    _pg.connect(cn, function(err, client_, done_) {
      if (err) {
        return cb(err, undefined);
      }
      return cb(undefined, {
        client: client_,
        done: done_
      });
    });
  },
  /**
  * @function getItemObject
  * @description Returns an uninitialized object literal representing a data grid row.
  * @returns {Object}
  */
  getItemObject: function getItemObject() {
    return {
      id: undefined,
      comment: undefined,
      price: undefined,
      amount: undefined,
      created: undefined,
      instock: undefined,
      country: {
        id: undefined,
        name: undefined,
        value: undefined
      }
    };
  },
  /**
  * @function getCountries
  * @description Retrieves all country name:value pairs as a JSON array.
  * @returns {[Object]} { name: '', value: '' }.
  */
  getCountries: function getCountries(client, cb) {
    // validation
    // client
    if (_.isUndefined(client) || _.isNull(client) || !_.isObject(client)) {
      return cb(new Error('Parameter client must be a Postgresql object.'), undefined);
    }
    // cb
    else if (_.isUndefined(cb) || _.isNull(cb) || !_.isFunction(cb)) {
      return cb(new Error('Parameter cb must be a function.'), undefined);
    }

    var query = 'select name, value from countries';
    client.query(query, function(err, data) {
      if (err) {
        return cb(err, undefined);
      }
      return cb(undefined, data);
    });

  },

  /**
  * @function getGridData
  * @description Retrieves paginated data from the items
  * @param {Object} client A postgresql client object.
  * @param {Number(Integer)} requestedPgNum The paginated page being requested.
  * @param {Number(Integer)} recsPerPg The number of records to be included in the paginated page.
   * @param {String} sortColName The column to sort on. Acceptable values include: 'none', 'fractional_amount', 'integer_amount', 'create_date' and 'cntry_name'.
   * @param {String} sortDirection 0 = ASC, 1 = DESC.
  * @param {Function} cb The callback function, {Undefined|Object}, {Undefined|Object}.
  * @returns {[Object]}
    { id: Number(Integer),
      comment: String,
      fractional_amount: Number(Decimal),
      integer_amount: Number(Integer),
      create_date: String,
      some_bool: Boolean,
      country: {
        name: String,
        value: Value
      }
    }
  */
  getGridData: function getGridData(client, requestedPgNum, recsPerPg, sortColName, sortDirection, cb) {
    // validation
    // client
    if (_.isUndefined(client) || _.isNull(client) || !_.isObject(client)) {
      return cb(new Error('Parameter client must be a Postgresql object.'), undefined);
    }
    // requestedPgNum
    else if (_.isUndefined(requestedPgNum) || _.isNull(requestedPgNum) || !_.isNumber(requestedPgNum) || (requestedPgNum < 0) || (requestedPgNum % 1 > 0)) {
      return cb(new Error('Parameter requestedPgNum must be a positive integer.'), undefined);
    }
    // recsPerPg
    else if (_.isUndefined(recsPerPg) || _.isNull(recsPerPg) || !_.isNumber(recsPerPg) || (recsPerPg < 0) || (recsPerPg % 1 > 0)) {
      return cb(new Error('Parameter recsPerPg must be a positive integer.'), undefined);
    }
    // sortColName
    else if (_.isUndefined(sortColName) || _.isNull(sortColName) || _str.trim(sortColName).length < 1) {
      return cb(new Error('Parameter sortColName must be a string.'), undefined);
    }
    else if (_str.trim(sortColName) !== 'none' && _str.trim(sortColName) !== 'fractional_amount' && _str.trim(sortColName) !== 'integer_amount' && _str.trim(sortColName) !== 'create_date' && _str.trim(sortColName) !== 'cntry_name') {
      return cb(new Error('Parameter sortColName is not a valid data grid column name.'), undefined);
    }
    // sortDirection
    if (_str.trim(sortColName) !== 'none') {
      if (_.isUndefined(sortDirection) || _.isNull(sortDirection) || !_.isNumber(sortDirection) || sortDirection % 1 > 0 || sortDirection < 0 || sortDirection > 1) {
        return cb(new Error('Parameter sortDirection must be a positive integer (0 or 1).'), undefined);
      }
    }
    // cb
    else if (_.isUndefined(cb) || _.isNull(cb) || !_.isFunction(cb)) {
      return cb(new Error('Parameter cb must be a function.'), undefined);
    }

    var queryRowCt = 'select count(id) numrows from items';
    client.query(queryRowCt, function(err, data) {
      if (err) {
        return cb(err, undefined);
      }

      var rowCt = data.rows[0].numrows;
      var maxPgs = (rowCt % recsPerPg > 0) ? (parseInt(rowCt/recsPerPg) + 1) : parseInt(rowCt/recsPerPg);
      if (requestedPgNum > maxPgs) {
        return cb(new Error('Exceeds maximum page count.'), undefined);
      }
      // determine offset
      var rowoffset = (requestedPgNum > 1) ? (parseInt(requestedPgNum*recsPerPg) - 1) : 0;

      var queryData;
      if (_str.trim(sortColName) === 'cntry_name') {
        queryData = 'select    dg.id,' +
                              'dg.comment, ' +
                              'dg.price, ' +
                              'dg.amount, ' +
                              'dg.created, ' +
                              'dg.instock, ' +
                              'dg.countryid, ' +
                              'dd.name as countryname, ' +
                              'dd.value as countryvalue ' +
                    'from   countries dd, items dg ' +
                    'where    dd.id = dg.countries ' +
                    'order by dd.name ' + sortDirection === 0 ? 'ASC ' : 'DESC ' +
                    'offset ' + rowoffset + ' limit ' + recsPerPg.toString(); // jshint ignore:line
      }
      else {
        queryData = 'select    t.id, ' +
                              't.comment, ' +
                              't.price, ' +
                              't.amount, ' +
                              't.created, ' +
                              't.countryid, ' +
                              '(getCountryNameVal(t.countryid)).name as countryname, ' +
                              '(getCountryNameVal(t.countryid)).val as countryvalue ' +
                    'from   (select   id, ' +
                                      'comment, ' +
                                      'price, ' +
                                      'amount, ' +
                                      'created, ' +
                                      'instock, ' +
                                      'countryid ' +
                            'from items ' +
                            (sortColName === 'none' ? '' : ('order by ' + sortColName + (sortDirection === 0 ? ' ASC' : ' DESC'))) + ') t ' +
                    'offset ' + rowoffset + ' limit ' + recsPerPg.toString(); // jshint ignore:line
      }

      client.query(queryData, function(err2, data2) {
        if (err2) {
          return cb(err2, undefined);
        }

        return cb(undefined, {
          totalPgs: maxPgs,
          currentPg: requestedPgNum,
          previousPg: (requestedPgNum === 1) ? 0 : (requestedPgNum - 1),
          nextPg: requestedPgNum + 1,
          rows: data2.rows
        });
      });
    });
  },

  /**
   * @function addItemRow
   * @description Adds a new grid row to the Item table.
   * @param {Object} client A postgresql client object.
   * @param {Object} gridRow {
   * id: undefined,
   * comment: undefined,
   * fractional_amount: undefined,
   * integer_amount: undefined,
   * create_date: undefined,
   * some_bool: undefined,
   * country: {
   *    value: undefined
   *  }
   * }
   * @param {Function} cb
   */
  addItemRow: function addItemRow(client, gridRow, cb) {
    // validation
    // client
    if (_.isUndefined(client) || _.isNull(client) || !_.isObject(client)) {
      return cb(new Error('Parameter client must be a Postgresql object.'), undefined);
    }
    // gridRow
    else if (_.isUndefined(gridRow) || _.isNull(gridRow) || !_.isObject(gridRow)) {
      return cb(new Error('Parameter gridRow must be an object literal.'), undefined);
    }
    // gridRow.comment
    else if (_.isUndefined(gridRow.comment) || _.isNull(gridRow.comment) || !_.isString(gridRow.comment) || _str.trim(gridRow.comment).length < 1 || _str.trim(gridRow.comment).length > 500) {
      return cb(new Error('Parameter gridRow.comment must be string (1,500).'), undefined);
    }
    // gridRow.fractional_amount
    else if (_.isUndefined(gridRow.price) || _.isNull(gridRow.price) || !_.isNumber(gridRow.price)) {
      return cb(new Error('Parameter gridRow.fractional_amount must be a decimal.'), undefined);
    }
    // gridRow.integer_amount
    else if (_.isUndefined(gridRow.amount) || _.isNull(gridRow.amount) || !_.isNumber(gridRow.amount) || gridRow.amount % 1 > 0) {
      return cb(new Error('Parameter gridRow.integer_amount must be an integer.'), undefined);
    }
    // gridRow.create_date
    else if (_.isUndefined(gridRow.created) || _.isNull(gridRow.created) || !_.isString(gridRow.created) || _str.trim(gridRow.created).length < 1) {
      return cb(new Error('Parameter gridRow.create_date must be a UTC formatted string.'), undefined);
    }
    var createDate = new Date(_str.trim(gridRow.created));
    if (!_.isDate(createDate)) {
      return cb(new Error('Parameter gridRow.create_date must be a UTC formatted string.'), undefined);
    }
    // gridRow.some_bool
    var instock = Boolean(gridRow.instock);
    if (_.isUndefined(gridRow.instock) || _.isNull(gridRow.instock) || !_.isBoolean(instock)) {
      return cb(new Error('Parameter gridRow.some_bool must be a boolean.'), undefined);
    }
    // gridRow.country
    else if (_.isUndefined(gridRow.country) || _.isNull(gridRow.country) || !_.isObject(gridRow.country)) {
      return cb(new Error('Parameter gridRow.country must be an object literal.'), undefined);
    }
    // gridRow.country.value
    else if (_.isUndefined(gridRow.country.value) || _.isNull(gridRow.country.value) || !_.isString(gridRow.country.value) || _str.trim(gridRow.country.value).length < 1 || _str.trim(gridRow.country.value).length > 30) {
      return cb(new Error('Parameter gridRow.country.value must be string (1,30).'), undefined);
    }
    // cb
    else if (_.isUndefined(cb) || _.isNull(cb) || !_.isFunction(cb)) {
      return cb(new Error('Parameter cb must be a function.'), undefined);
    }

    // ensure cntry exists
    var query1 = 'select id from countries where value = \'' + _str.trim(gridRow.country.value) + '\'';
    client.query(query1, function(err1, data1) {
      if (err1) {
        return cb(err1, undefined);
      }
      var dropDownId = data1.rows[0].id;

      // perform the insert
      var query2 = 'insert into items ( ' +
                        'comment, ' +
                        'price, ' +
                        'amount, ' +
                        'created, ' +
                        'instock, ' +
                        'countryid' +
                      ') values (' +
                        '\'' + gridRow.comment + '\',' +
                        '\'' + gridRow.price.toString() + '\',' +
                        '\'' + gridRow.amount.toString() + '\',' +
                        '\'' + gridRow.created + '\',' +
                        '\'' + gridRow.instock + '\',' +
                        '\'' + dropDownId.toString() + '\'' +
                      ') returning id';

      client.query(query2, function(err2, data2) {
        if (err2) {
          return cb(err2, undefined);
        }
        return cb(undefined, data2.rows);
      });
    });
  },

  /**
   * @function deleteGridRow
   * @description Deletes a row from the items table.
   * @param {Object} client A postgresql client object.
   * @param {Integer} id A Item row identifier.
   * @param {Function} cb
   */
  deleteItemRow: function deleteItemRow(client, id, cb) {
    // validation
    // client
    if (_.isUndefined(client) || _.isNull(client) || !_.isObject(client)) {
      return cb(new Error('Parameter client must be a Postgresql object.'), undefined);
    }
    // id
    else if (_.isUndefined(id) || _.isNull(id)) {
      return cb(new Error('Parameter id must be an integer.'), undefined);
    //|| !_.isNumber(id) || id % 1 > 0
    }

    // cb
    else if (_.isUndefined(cb) || _.isNull(cb) || !_.isFunction(cb)) {
      return cb(new Error('Parameter cb must be a function.'), undefined);
    }

    var query = 'delete from items where id = \'' + id.toString() + '\'';
    client.query(query, function(err, data) {
      if (err) {
        return cb(err, undefined);
      }
      return cb(undefined, data);
    });
  }
};
