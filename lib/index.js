'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _moment = require('moment');

var _mathjs = require('mathjs');

var _lodash = require('lodash');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var FormatDurationOutputIntervals = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];
var generateFormattedDurationFromTimestamp = function generateFormattedDurationFromTimestamp(durationTimestampInput, formatting) {
  var positive = Number(durationTimestampInput) >= 0;
  var durationTimestamp = (0, _mathjs.abs)(Number(durationTimestampInput));
  var intervals = (0, _lodash.intersection)(FormatDurationOutputIntervals, (0, _lodash.filter)(formatting.interval, function (interval) {
    return (0, _lodash.includes)(FormatDurationOutputIntervals, interval);
  }));
  if (intervals.length === 0) {
    return durationTimestamp;
  }
  var initVal = {
    remainderDuration: (0, _moment.duration)(durationTimestamp),
    lastInterval: (0, _lodash.last)(intervals),
    formatting: formatting,
    results: []
  };
  var outputResult = intervals.reduce(function (acc, interval) {
    var selectedIntervalValue = void 0;
    if (interval === acc.lastInterval) {
      var availableIntervalDuration = acc.remainderDuration.as(interval);
      if (acc.formatting.decimalPlaces === -1) {
        selectedIntervalValue = Number((0, _mathjs.format)(availableIntervalDuration, { notation: 'fixed', precision: 2 }));
      } else if (acc.formatting.decimalPlaces === 0) {
        selectedIntervalValue = (0, _mathjs.round)(availableIntervalDuration);
      } else {
        selectedIntervalValue = (0, _mathjs.format)(availableIntervalDuration, {
          notation: 'fixed',
          precision: acc.formatting.decimalPlaces
        });
      }
    } else {
      selectedIntervalValue = (0, _mathjs.floor)(acc.remainderDuration.as(interval));
    }
    return _extends({}, acc, {
      remainderDuration: acc.remainderDuration.subtract(selectedIntervalValue, interval),
      results: [].concat(_toConsumableArray(acc.results), [selectedIntervalValue + ' ' + interval])
    });
  }, initVal);
  return positive ? outputResult.results.join(' ') : '-(' + outputResult.results.join(' ') + ')';
};
var generateFormattedTime = function generateFormattedTime(selectedFormat, input) {
  var inputAsInt = parseInt(input, 10);
  var momentObj = (0, _moment.utc)(inputAsInt, 'x');
  if (!momentObj.isValid()) {
    return input;
  }
  if (selectedFormat === '12HR') {
    return momentObj.format('hh:mm:ss a');
  }
  return momentObj.format('HH:mm:ss');
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
      interval = formatting.interval,
      selectedFormat = formatting.selectedFormat;

  switch (columnType) {
    case 'FORMULA_DURATION':
      formattedNumber = generateFormattedDurationFromTimestamp(value, formatting);
      break;
    case 'DURATION':
      formattedNumber = value + ' ' + interval[0] + (value > 1 ? 's' : '');
      break;
    case 'TIME':
      formattedNumber = generateFormattedTime(selectedFormat, value);
      break;
    default:
      try {
        var roundedValue = decimalPlaces > -1 ? (0, _mathjs.format)((0, _mathjs.number)(value), {
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

exports.default = function (value, _ref) {
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
//# sourceMappingURL=index.js.map