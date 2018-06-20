'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* global window */
/* eslint-disable func-names */


var _moment = require('moment');

var _format = require('mathjs/lib/function/string/format');

var _format2 = _interopRequireDefault(_format);

var _number = require('mathjs/lib/type/number');

var _number2 = _interopRequireDefault(_number);

var _floor = require('mathjs/lib/function/arithmetic/floor');

var _floor2 = _interopRequireDefault(_floor);

var _round = require('mathjs/lib/function/arithmetic/round');

var _round2 = _interopRequireDefault(_round);

var _abs = require('mathjs/lib/function/arithmetic/abs');

var _abs2 = _interopRequireDefault(_abs);

var _includes = require('lodash/includes');

var _includes2 = _interopRequireDefault(_includes);

var _filter = require('lodash/filter');

var _filter2 = _interopRequireDefault(_filter);

var _last = require('lodash/last');

var _last2 = _interopRequireDefault(_last);

var _intersection = require('lodash/intersection');

var _intersection2 = _interopRequireDefault(_intersection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function (applyColumnFormat) {
  if (typeof module !== 'undefined') {
    module.exports = applyColumnFormat();
  } else {
    window.Envisio = window.Envisio || {};
    window.Envisio.applyColumnFormat = window.Envisio.applyColumnFormat || applyColumnFormat();
  }
})(function () {
  var FormatDurationOutputIntervals = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];
  var generateFormattedDurationFromTimestamp = function generateFormattedDurationFromTimestamp(durationTimestampInput, formatting) {
    var positive = Number(durationTimestampInput) >= 0;
    var durationTimestamp = (0, _abs2.default)(Number(durationTimestampInput));
    var intervals = (0, _intersection2.default)(FormatDurationOutputIntervals, (0, _filter2.default)(formatting.interval, function (interval) {
      return (0, _includes2.default)(FormatDurationOutputIntervals, interval);
    }));
    if (intervals.length === 0) {
      return durationTimestamp;
    }
    var initVal = {
      remainderDuration: (0, _moment.duration)(durationTimestamp),
      lastInterval: (0, _last2.default)(intervals),
      formatting: formatting,
      results: []
    };
    var outputResult = intervals.reduce(function (acc, interval) {
      var selectedIntervalValue = void 0;
      if (interval === acc.lastInterval) {
        var availableIntervalDuration = acc.remainderDuration.as(interval);
        if (acc.formatting.decimalPlaces === -1) {
          selectedIntervalValue = Number((0, _format2.default)(availableIntervalDuration, { notation: 'fixed', precision: 2 }));
        } else if (acc.formatting.decimalPlaces === 0) {
          selectedIntervalValue = (0, _round2.default)(availableIntervalDuration);
        } else {
          selectedIntervalValue = (0, _format2.default)(availableIntervalDuration, {
            notation: 'fixed',
            precision: acc.formatting.decimalPlaces
          });
        }
      } else {
        selectedIntervalValue = (0, _floor2.default)(acc.remainderDuration.as(interval));
      }
      return _extends({}, acc, {
        remainderDuration: acc.remainderDuration.subtract(selectedIntervalValue, interval),
        results: [].concat(_toConsumableArray(acc.results), [selectedIntervalValue + ' ' + interval])
      });
    }, initVal);
    return positive ? outputResult.results.join(' ') : '-(' + outputResult.results.join(' ') + ')';
  };
  var insertThousandSeparators = function insertThousandSeparators(value, separator) {
    var parts = value.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  };
  var formatNumber = function formatNumber(value, formatting, columnType) {
    var formattedNumber = void 0;
    var units = formatting.units,
        decimalPlaces = formatting.decimalPlaces,
        thousandSeparator = formatting.thousandSeparator,
        interval = formatting.interval;

    switch (columnType) {
      case 'FORMULA_DURATION':
        formattedNumber = generateFormattedDurationFromTimestamp(value, formatting);
        break;
      case 'DURATION':
        formattedNumber = value + ' ' + interval[0] + (value > 1 ? 's' : '');
        break;
      default:
        try {
          var roundedValue = decimalPlaces > -1 ? (0, _format2.default)((0, _number2.default)(value), {
            notation: 'fixed',
            precision: decimalPlaces
          }) : value;
          var valueWithSeperators = thousandSeparator.length ? roundedValue : insertThousandSeparators(roundedValue, thousandSeparator);
          formattedNumber = '' + units.prefix + valueWithSeperators + units.postfix;
        } catch (e) {
          formattedNumber = value;
        }
        break;
    }
    return formattedNumber;
  };
  return function (value, _ref) {
    var columnType = _ref.columnType,
        formatting = _ref.formatting;

    var columnValue = void 0;
    if (value === '') {
      columnValue = '';
    } else if (value === 'ERROR') {
      columnValue = 'ERROR';
    } else {
      switch (columnType) {
        case 'DATE':
          columnValue = (0, _moment.utc)(parseInt(value, 0)).format('ll');
          break;
        case 'DATETIME':
          columnValue = (0, _moment.utc)(parseInt(value, 0)).format('MMM D, YYYY HH:mm:ss');
          break;
        case 'FORMULA_DATETIME':
          columnValue = (0, _moment.utc)(parseInt(value, 0)).format('MMM D, YYYY HH:mm:ss');
          break;
        case 'SOURCE':
          throw new Error('Cannot resolve columnType: SOURCE formatting');
        case 'AGGREGATION_SOURCE':
          columnValue = value;
          break;
        default:
          columnValue = formatNumber(value, formatting, columnType);
          break;
      }
    }
    return columnValue;
  };
});
//# sourceMappingURL=index.js.map