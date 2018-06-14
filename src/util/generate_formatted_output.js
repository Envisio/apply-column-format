import moment from 'moment';
import { format, floor, round, abs } from 'mathjs';
import { includes, filter, last, intersection } from 'lodash';

const FormatDurationOutputIntervals = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];
export default (durationTimestampInput, formatting) => {
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
    remainderDuration: moment.duration(durationTimestamp),
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
