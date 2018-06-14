import moment from 'moment';
import { format, number } from 'mathjs';
import { isEmpty } from 'lodash';
import generateFormattedDurationFromTimestamp from './util/generate_formatted_output';

const insertThousandSeparators = (value, separator) => {
  const parts = value.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return parts.join('.');
};
const formatNumber = (value, formatting, columnType) => {
  let formattedNumber;
  const {
    units, decimalPlaces, thousandSeparator, interval,
  } = formatting;
  switch (columnType) {
    case 'FORMULA_DURATION':
      formattedNumber = generateFormattedDurationFromTimestamp(value, formatting);
      break;
    case 'DURATION':
      formattedNumber = `${value} ${interval[0]}${value > 1 ? 's' : ''}`;
      break;
    default:
      try {
        const roundedValue = decimalPlaces > -1 ? format(number(value), {
          notation: 'fixed',
          precision: decimalPlaces,
        }) : value;
        const valueWithSeperators = isEmpty(thousandSeparator)
          ? roundedValue
          : insertThousandSeparators(roundedValue, thousandSeparator);
        formattedNumber = `${units.prefix}${valueWithSeperators}${units.postfix}`;
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
module.exports = (value, { columnType, formatting }) => {
  let columnValue;
  if (value === '') {
    columnValue = '';
  } else if (value === 'ERROR') {
    columnValue = 'ERROR';
  } else {
    switch (columnType) {
      case 'DATE':
        columnValue = moment.utc(parseInt(value, 0)).format('ll');
        break;
      case 'DATETIME':
        columnValue = moment.utc(parseInt(value, 0)).format('MMM D, YYYY HH:mm:ss');
        break;
      case 'FORMULA_DATETIME':
        columnValue = moment.utc(parseInt(value, 0)).format('MMM D, YYYY HH:mm:ss');
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
