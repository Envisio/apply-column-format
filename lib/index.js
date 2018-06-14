'use strict';

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _mathjs = require('mathjs');

var _lodash = require('lodash');

var _generate_formatted_output = require('./util/generate_formatted_output');

var _generate_formatted_output2 = _interopRequireDefault(_generate_formatted_output);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      formattedNumber = (0, _generate_formatted_output2.default)(value, formatting);
      break;
    case 'DURATION':
      formattedNumber = value + ' ' + interval[0] + (value > 1 ? 's' : '');
      break;
    default:
      try {
        var roundedValue = decimalPlaces > -1 ? (0, _mathjs.format)((0, _mathjs.number)(value), {
          notation: 'fixed',
          precision: decimalPlaces
        }) : value;
        var valueWithSeperators = (0, _lodash.isEmpty)(thousandSeparator) ? roundedValue : insertThousandSeparators(roundedValue, thousandSeparator);
        formattedNumber = '' + units.prefix + valueWithSeperators + units.postfix;
      } catch (e) {
        formattedNumber = value;
      }
      break;
  }
  return formattedNumber;
};
/**
 * @param {String} value
 * @param {Object} columnType
 * @returns {String}
 */
module.exports = function (value, _ref) {
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
        columnValue = _moment2.default.utc(parseInt(value, 0)).format('ll');
        break;
      case 'DATETIME':
        columnValue = _moment2.default.utc(parseInt(value, 0)).format('MMM D, YYYY HH:mm:ss');
        break;
      case 'FORMULA_DATETIME':
        columnValue = _moment2.default.utc(parseInt(value, 0)).format('MMM D, YYYY HH:mm:ss');
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