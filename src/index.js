import { duration, utc } from 'moment';
import {
  format, number, floor, round, abs,
} from 'mathjs';
import {
  includes, filter, last, intersection,
} from 'lodash';

const FormatDurationOutputIntervals = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];
const generateFormattedDurationFromTimestamp = (durationTimestampInput, formatting) => {
  const positive = Number(durationTimestampInput) >= 0;
  const durationTimestamp = abs(Number(durationTimestampInput));
  const intervals = intersection(
    FormatDurationOutputIntervals,
    filter(formatting.interval, interval => includes(FormatDurationOutputIntervals, interval)),
  );
  if (intervals.length === 0) {
    return durationTimestamp;
  }
  const initVal = {
    remainderDuration: duration(durationTimestamp),
    lastInterval: last(intervals),
    formatting,
    results: [],
  };
  const outputResult = intervals.reduce((acc, interval) => {
    let selectedIntervalValue;
    if (interval === acc.lastInterval) {
      const availableIntervalDuration = acc.remainderDuration.as(interval);
      if (acc.formatting.decimalPlaces === -1) {
        selectedIntervalValue = Number(format(
          availableIntervalDuration,
          { notation: 'fixed', precision: 2 },
        ));
      } else if (acc.formatting.decimalPlaces === 0) {
        selectedIntervalValue = round(availableIntervalDuration);
      } else {
        selectedIntervalValue = format(availableIntervalDuration, {
          notation: 'fixed',
          precision: acc.formatting.decimalPlaces,
        });
      }
    } else {
      selectedIntervalValue = floor(acc.remainderDuration.as(interval));
    }
    return {
      ...acc,
      remainderDuration: acc.remainderDuration.subtract(selectedIntervalValue, interval),
      results: [
        ...acc.results,
        `${selectedIntervalValue} ${interval}`,
      ],
    };
  }, initVal);
  return positive ? outputResult.results.join(' ') : `-(${outputResult.results.join(' ')})`;
};
const generateFormattedTime = (selectedFormat, input) => {
  const inputAsInt = parseInt(input, 10);
  const momentObj = utc(inputAsInt, 'x');
  if (!momentObj.isValid()) {
    return input;
  }
  if (selectedFormat === '12HR') {
    return momentObj.format('hh:mm:ss a');
  }
  return momentObj.format('HH:mm:ss');
};
const insertThousandSeparators = (value, separator) => {
  const parts = value.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return parts.join('.');
};
const formatNumber = (value, formatting, columnType) => {
  let formattedNumber;
  const {
    units, decimalPlaces, thousandSeparator, interval, selectedFormat,
  } = formatting;
  switch (columnType) {
    case 'FORMULA_DURATION':
      formattedNumber = generateFormattedDurationFromTimestamp(value, formatting);
      break;
    case 'DURATION':
      formattedNumber = `${value} ${interval[0]}${value > 1 ? 's' : ''}`;
      break;
    case 'TIME':
      formattedNumber = generateFormattedTime(selectedFormat, value);
      break;
    default:
      try {
        const roundedValue = decimalPlaces > -1 ? format(number(value), {
          notation: 'fixed',
          precision: decimalPlaces,
        }) : value;
        const valueWithSeperators = thousandSeparator.length
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
export default (value, { columnType, formatting }) => {
  let columnValue;
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
