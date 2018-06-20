'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* global Envisio, _, mathjs, moment */
/* eslint-disable func-names */
var _ref = _,
    filter = _ref.filter,
    last = _ref.last,
    includes = _ref.includes,
    intersection = _ref.intersection;
var _moment = moment,
    duration = _moment.duration,
    utc = _moment.utc;
var _mathjs = mathjs,
    abs = _mathjs.abs,
    format = _mathjs.format,
    number = _mathjs.number,
    floor = _mathjs.floor,
    round = _mathjs.round;

var FormatDurationOutputIntervals = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];
var generateFormattedDurationFromTimestamp = function generateFormattedDurationFromTimestamp(durationTimestampInput, formatting) {
  var positive = Number(durationTimestampInput) >= 0;
  var durationTimestamp = abs(Number(durationTimestampInput));
  var intervals = intersection(FormatDurationOutputIntervals, filter(formatting.interval, function (interval) {
    return includes(FormatDurationOutputIntervals, interval);
  }));
  if (intervals.length === 0) {
    return durationTimestamp;
  }
  var initVal = {
    remainderDuration: duration(durationTimestamp),
    lastInterval: last(intervals),
    formatting: formatting,
    results: []
  };
  var outputResult = intervals.reduce(function (acc, interval) {
    var selectedIntervalValue = void 0;
    if (interval === acc.lastInterval) {
      var availableIntervalDuration = acc.remainderDuration.as(interval);
      if (acc.formatting.decimalPlaces === -1) {
        selectedIntervalValue = Number(format(availableIntervalDuration, { notation: 'fixed', precision: 2 }));
      } else if (acc.formatting.decimalPlaces === 0) {
        selectedIntervalValue = round(availableIntervalDuration);
      } else {
        selectedIntervalValue = format(availableIntervalDuration, {
          notation: 'fixed',
          precision: acc.formatting.decimalPlaces
        });
      }
    } else {
      selectedIntervalValue = floor(acc.remainderDuration.as(interval));
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
        var roundedValue = decimalPlaces > -1 ? format(number(value), {
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
Envisio.applyColumnFormat = Envisio.applyColumnFormat || function (value, _ref2) {
  var columnType = _ref2.columnType,
      formatting = _ref2.formatting;

  var columnValue = void 0;
  if (value === '') {
    columnValue = '';
  } else if (value === 'ERROR') {
    columnValue = 'ERROR';
  } else {
    switch (columnType) {
      case 'DATE':
        columnValue = utc(parseInt(value, 0)).format('ll');
        break;
      case 'DATETIME':
        columnValue = utc(parseInt(value, 0)).format('MMM D, YYYY HH:mm:ss');
        break;
      case 'FORMULA_DATETIME':
        columnValue = utc(parseInt(value, 0)).format('MMM D, YYYY HH:mm:ss');
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
//# sourceMappingURL=function.js.map