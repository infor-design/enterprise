/* eslint-disable no-underscore-dangle */
import { utils } from '../../utils/utils';
import { numberUtils } from '../../utils/number';

/**
* An api for grouping data by a given field (s)
* @private
*/
const groupBy = (function () {
  const equals = utils.equals;

  // See if the object has these proprties or not
  const has = function (obj, target) {
    return obj.some(value => equals(value, target));
  };

  // Return just the object properties matching the names
  const pick = function (obj, names) {
    const chosen = {};
    for (let i = 0, l = names.length; i < l; i++) {
      chosen[names[i]] = obj[names[i]];
    }
    return chosen;
  };

  // Return the specific keys from the object
  const keys = function (data, names) {
    return data.reduce((memo, item) => {
      const key = pick(item, names);

      if (!has(memo, key)) {
        memo.push(key);
      }
      return memo;
    }, []);
  };

  // Look through each value in the list and return an array of all the values
  // that contain all of the key-value pairs listed in properties.
  const where = function (data, names) {
    const chosen = [];

    /* eslint-disable */
    data.map(function (item, idx) {
      let match = true;
      for (const prop in names) {
        if (names[prop] !== item[prop]) {
          match = false;
          return;
        }
      }
      item.idx = idx;
      chosen.push(item);
      return;
    });
    /* eslint-enable */

    return chosen;
  };

  // Grouping Function with Plugins/Aggregator
  const group = function (data, names) {
    const stems = keys(data, names);

    return stems.map(stem => ({
      key: stem,
      values: where(data, stem).map(item => item)
    }));
  };

  // Register an aggregator
  group.register = function (name, converter) {
    group[name] = function (data, names, extra) {
      const that = this;
      that.extra = extra;
      return group(data, names).map(converter, that);
    };
    return group[name];
  };

  return group;
}());

/**
* Register built in aggregators
* @private
*/
groupBy.register('none', item => $.extend({}, item.key, { values: item.values }));

groupBy.register('sum', function (item) {
  const field = this.extra;
  const nonEmpty = item.values.map(row => row[field])
    .filter(val => val !== undefined && val !== null);
  return $.extend(
    {},
    item.key,
    { values: item.values },
    { sum: nonEmpty.reduce((a, b) => Number(a) + Number(b), 0) }
  );
});

groupBy.register('max', function (item) {
  const field = this.extra;
  return $.extend(
    {},
    item.key,
    { values: item.values }, // eslint-disable-next-line
    { max: Math.max(...item.values.map(row => row[field]).filter(val => val !== undefined && val !== null)) }
  );
});

groupBy.register('min', function (item) {
  const field = this.extra;
  return $.extend(
    {},
    item.key,
    { values: item.values }, // eslint-disable-next-line
    { min: Math.min(...item.values.map(row => row[field]).filter(val => val !== undefined && val !== null)) }
  );
});

groupBy.register('avg', function (item) {
  const field = this.extra;
  const nonEmpty = item.values.map(row => row[field])
    .filter(val => val !== undefined && val !== null);
  return $.extend(
    {},
    item.key,
    { values: item.values },
    { avg: nonEmpty.reduce((a, b) => Number(a) + Number(b), 0) / nonEmpty.length }
  );
});

groupBy.register('count', function (item) {
  const field = this.extra;
  const nonEmpty = item.values.map(row => row[field])
    .filter(val => val !== undefined && val !== null);
  return $.extend(
    {},
    item.key,
    { values: item.values },
    { count: nonEmpty.length }
  );
});

groupBy.register('list', function (item) {
  const extra = this.extra;

  return $.extend(
    {},
    item.key,
    { values: item.values },
    {
      list: item.values.map((thisItem) => {
        const list = [];

        for (let i = 0, l = extra.list.length; i < l; i++) {
          const exclude = extra.exclude ? thisItem[extra.exclude] : false;
          if (thisItem[extra.list[i]] && !exclude) {
            list.push({ value: thisItem[extra.list[i]], key: extra.list[i] });
          }
        }
        return list;
      })
    }
  );
});

/**
* Simple Summary Row Accumlator
* @private
*/
const aggregators = {};
aggregators.aggregate = function (items, columns) {
  const totals = {};
  const self = this;

  for (let i = 0, l = columns.length; i < l; i++) {
    if (columns[i].aggregator) {
      const field = columns[i].field;

      self.sum = function (sum, node) {
        if (node._isFilteredOut) { // eslint-disable-line
          return sum;
        }

        let value;

        if (field.indexOf('.') > -1) {
          value = field.split('.').reduce((o, x) => (o ? o[x] : ''), node);
        } else {
          value = node[field];
        }

        value = Number(value);
        const valuePlaces = numberUtils.decimalPlaces(value);
        const sumPlaces = numberUtils.decimalPlaces(sum);
        return Number((sum + value).toFixed(Math.max(valuePlaces, sumPlaces)));
      };

      const total = items.reduce(self[columns[i].aggregator], 0);

      if (field.indexOf('.') > -1) {
        let currentObj = totals;
        for (let j = 0, k = field.split('.').length; j < k; j++) {
          if (j === field.split('.').length - 1) {
            currentObj[field.split('.')[j]] = total;
          } else {
            if (!(field.split('.')[j] in currentObj)) {
              currentObj[field.split('.')[j]] = {};
            }

            currentObj = currentObj[field.split('.')[j]];
          }
        }
      } else {
        totals[field] = total;
      }
    }
  }

  return totals;
};

export { groupBy as GroupBy, aggregators as Aggregators };
