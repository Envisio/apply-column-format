'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _mathjs = require('mathjs');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var FormatDurationOutputIntervals = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];

exports.default = function (durationTimestampInput, formatting) {
  var positive = Number(durationTimestampInput) >= 0;
  var durationTimestamp = (0, _mathjs.abs)(Number(durationTimestampInput));
  var intervals = (0, _lodash.intersection)(FormatDurationOutputIntervals, (0, _lodash.filter)(formatting.interval, function (interval) {
    return (0, _lodash.includes)(FormatDurationOutputIntervals, interval);
  }));
  if (intervals.length === 0) {
    return durationTimestamp;
  }
  var initVal = {
    remainderDuration: _moment2.default.duration(durationTimestamp),
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
//# sourceMappingURL=generate_formatted_output.js.map