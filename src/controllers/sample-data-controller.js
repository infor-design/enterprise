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
		var cn = 'pg://sampledatauser:soho@localhost:5432/soho';

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
	* @function getDataGridObject
	* @description Returns an uninitialized object literal representing a data grid row.
	* @returns {Object}
	*/
	getDataGridObject: function getDataGridObject() {
		return {
			id: undefined,
			comment: undefined,
			fractional_amount: undefined,
			integer_amount: undefined,
			create_date: undefined,
			some_bool: undefined,
			country: {
        id: undefined,
				name: undefined,
				value: undefined
			}
		}
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

		var query = 'select name, value from dropdown';
		client.query(query, function(err, data) {
			if (err) {
				return cb(err, undefined);
			}
			return cb(undefined, data);
		});

	},
	/**
	* @function getGridData
	* @description Retrieves paginated data from the datagrid
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

		var queryRowCt = 'select count(id) numrows from datagrid';
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
        queryData = 'select		 dg.id,' +
                              'dg.comment, ' +
                              'dg.fractional_amount, ' +
                              'dg.integer_amount, ' +
                              'dg.create_date, ' +
                              'dg.some_bool, ' +
                              'dg.dropdown_id, ' +
                              'dd.name as cntry_name, ' +
                              'dd.value as cntry_value ' +
                    'from		dropdown dd, datagrid dg ' +
                    'where		dd.id = dg.dropdown_id ' +
                    'order by	dd.name ' + sortDirection === 0 ? 'ASC ' : 'DESC ' +
                    'offset ' + rowoffset + ' limit ' + recsPerPg.toString();
      }
      else {
        queryData = 'select 	 t.id, ' +
                              't.comment, ' +
                              't.fractional_amount, ' +
                              't.integer_amount, ' +
                              't.create_date, ' +
                              't.dropdown_id, ' +
                              '(getCountryNameVal(t.dropdown_id)).name as cntry_name, ' +
                              '(getCountryNameVal(t.dropdown_id)).val as cntry_value ' +
                    'from 	(select 	id, ' +
                                      'comment, ' +
                                      'fractional_amount, ' +
                                      'integer_amount, ' +
                                      'create_date, ' +
                                      'some_bool, ' +
                                      'dropdown_id ' +
                            'from 	datagrid ' +
                            (sortColName === 'none' ? '' : ('order by ' + sortColName + (sortDirection === 0 ? ' ASC' : ' DESC'))) + ') t ' +
                    'offset ' + rowoffset + ' limit ' + recsPerPg.toString();
      }

			client.query(queryData, function(err2, data2) {
				if (err2) {
					return cb(err2, undefined);
				}

				return cb(undefined, {
					totalPgs: maxPgs,
					currentPg: requestedPgNum,
					previousPg: (requestedPgNum == 1) ? 0 : (requestedPgNum - 1),
					nextPg: requestedPgNum + 1,
					rows: data2.rows
				});
			});
		});
	},
  /**
   * @function addDataGridRow
   * @description Adds a new grid row to the datagrid table.
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
  addDataGridRow: function addDataGridRow(client, gridRow, cb) {
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
    else if (_.isUndefined(gridRow.fractional_amount) || _.isNull(gridRow.fractional_amount) || !_.isNumber(gridRow.fractional_amount)) {
      return cb(new Error('Parameter gridRow.fractional_amount must be a decimal.'), undefined);
    }
    // gridRow.integer_amount
    else if (_.isUndefined(gridRow.integer_amount) || _.isNull(gridRow.integer_amount) || !_.isNumber(gridRow.integer_amount) || gridRow.integer_amount % 1 > 0) {
      return cb(new Error('Parameter gridRow.integer_amount must be an integer.'), undefined);
    }
    // gridRow.create_date
    else if (_.isUndefined(gridRow.create_date) || _.isNull(gridRow.create_date) || !_.isString(gridRow.create_date) || _str.trim(gridRow.create_date).length < 1) {
      return cb(new Error('Parameter gridRow.create_date must be a UTC formatted string.'), undefined);
    }
    var createDate = new Date(_str.trim(gridRow.create_date));
    if (!_.isDate(createDate)) {
      return cb(new Error('Parameter gridRow.create_date must be a UTC formatted string.'), undefined);
    }
    // gridRow.some_bool
    var someBool = Boolean(gridRow.some_bool);
    if (_.isUndefined(gridRow.some_bool) || _.isNull(gridRow.some_bool) || !_.isBoolean(someBool)) {
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
    var query1 = "select id from dropdown where value = '" + _str.trim(gridRow.country.value) + "'";
    client.query(query1, function(err1, data1) {
      if (err1) {
        return cb(err1, undefined);
      }
      var dropDownId = data1.rows[0].id;

      // perform the insert
      var query2 = "insert into datagrid ( " +
                        "comment, " +
                        "fractional_amount, " +
                        "integer_amount, " +
                        "create_date, " +
                        "some_bool, " +
                        "dropdown_id" +
                      ") values (" +
                        "'" + gridRow.comment + "'," +
                        "'" + gridRow.fractional_amount.toString() + "'," +
                        "'" + gridRow.integer_amount.toString() + "'," +
                        "'" + gridRow.create_date + "'," +
                        "'" + gridRow.some_bool + "'," +
                        "'" + dropDownId.toString() + "'" +
                      ") returning id";
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
   * @description Deletes a row from the datagrid table.
   * @param {Object} client A postgresql client object.
   * @param {Integer} id A datagrid row identifier.
   * @param {Function} cb
   */
  deleteGridRow: function deleteGridRow(client, id, cb) {
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

    var query = "delete from datagrid where id = '" + id.toString() + "'";
    client.query(query, function(err, data) {
      if (err) {
        return cb(err, undefined);
      }
      return cb(undefined, data);
    });
  }
}
