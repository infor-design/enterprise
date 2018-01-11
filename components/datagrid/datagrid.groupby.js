/* eslint-disable */
import { utils } from '../utils/utils';

/**
* An api for grouping data by a given field (s)
* @private
*/
const groupBy = (function() {

  //Can also use in isEquivalent: function(obj1, obj2)  in datagrid.js
  var equals = utils.equals;

  //See if the object has these proprties or not
  var has = function(obj, target) {
    return obj.some(function(value) {
        return equals(value, target);
    });
  };

  //Return just the object properties matching the names
  var pick = function(obj, names) {
    var chosen = {};
    for (var i = 0; i < names.length; i++) {
      chosen[names[i]] = obj[names[i]];
    }
    return chosen;
  };

  //Return the specific keys from the object
  var keys = function(data, names) {
    return data.reduce(function(memo, item) {
      var key = pick(item, names);

      if (!has(memo, key)) {
        memo.push(key);
      }
      return memo;
    }, []);
  };

  //Look through each value in the list and return an array of all the values
  //that contain all of the key-value pairs listed in properties.
  var where = function (data, names) {
    var chosen = [];

    data.map(function(item) {
      var match = true;
      for (var prop in names) {
        if (names[prop] !== item[prop]) {
          match = false;
          return;
        }
      }
      chosen.push(item);
      return;
    });

    return chosen;
  };

  //Grouping Function with Plugins/Aggregator
  var group = function(data, names) {
    var stems = keys(data, names);

    return stems.map(function(stem) {
      return {
        key: stem,
        values: where(data, stem).map(function(item) {
          return item;
        })
      };
    });
  };

  //Register an aggregator
  group.register = function(name, converter) {
    return group[name] = function(data, names, extra) { // jshint ignore:line
      var that = this;
      that.extra = extra;
      return group(data, names).map(converter, that);
    };
  };

  return group;
}());

/**
* Register built in aggregators
* @private
*/
groupBy.register('none', function(item) {
  return $.extend({}, item.key, {values: item.values});
});

groupBy.register('sum', function(item) {
  var extra = this.extra;
  return $.extend({}, item.key, {values: item.values}, {sum: item.values.reduce(function(memo, node) {
      return memo + Number(node[extra]);
  }, 0)});
});

groupBy.register('max', function(item) {
  var extra = this.extra;
  return $.extend({}, item.key, {values: item.values}, {max: item.values.reduce(function(memo, node) {
      return Math.max(memo, Number(node[extra]));
  }, Number.NEGATIVE_INFINITY)});
});

groupBy.register('list', function(item) {
  var extra = this.extra;

  return $.extend({}, item.key, {values: item.values}, {list: item.values.map(function(item) {
    var list = [];

    for (var i = 0; i < extra.list.length; i++) {
      var exclude = extra.exclude ? item[extra.exclude] : false;
      if (item[extra.list[i]] && !exclude) {
        list.push({value: item[extra.list[i]], key: extra.list[i]});
      }
    }
    return list;
  })});
});

/**
* Simple Summary Row Accumlator
* @private
*/
let aggregators = {};
aggregators.aggregate = function (items, columns) {
    var totals = {}, self = this;

    for (var i = 0; i < columns.length; i++) {
        if (columns[i].aggregator) {
            var field = columns[i].field;

            self.sum = function (sum, node) {
                var value;
                if (field.indexOf('.') > -1) {
                    value = field.split('.').reduce(function (o, x) {
                        return (o ? o[x] : '');
                    }, node);
                }
                else {
                    value = node[field];
                }
                return sum + Number(value);
            };

            var total = items.reduce(self[columns[i].aggregator], 0);

            if (field.indexOf('.') > -1) {
                var currentObj = totals;
                for (var j = 0; j < field.split('.').length; j++) {
                    if (j === field.split('.').length - 1) {
                        currentObj[field.split('.')[j]] = total;
                    }
                    else {
                        if (!(field.split('.')[j] in currentObj)) {
                            currentObj[field.split('.')[j]] = {};
                        }

                        currentObj = currentObj[field.split('.')[j]];
                    }
                }
            }
            else {
                totals[field] = total;
            }
        }
    }

    return totals;
};

export { groupBy as GroupBy, aggregators as Aggregators};
