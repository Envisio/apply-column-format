const { expect } = require('chai');
const { describe, it } = require('mocha');
const applyColumnFormat = require('../lib/index');

describe('When value is empty string:', () => {
  it('Should be empty string.', () => {
    expect(applyColumnFormat('', {})).to.equal('');
  });
});
describe('When value with Error:', () => {
  it('Should be Error string.', () => {
    expect(applyColumnFormat('ERROR', {})).to.equal('ERROR');
  });
});
describe('When column type is DATE:', () => {
  it('Should be in date format.', () => {
    expect(applyColumnFormat('0', { columnType: 'DATE' })).to.equal('Jan 1, 1970');
  });
});
describe('When column type is DATETIME:', () => {
  it('Should be in datetime format.', () => {
    expect(applyColumnFormat('0', { columnType: 'DATETIME' })).to.equal('Jan 1, 1970 00:00:00');
  });
});
describe('When column type is FORMULA_DATETIME:', () => {
  it('Should be in datetime format.', () => {
    expect(applyColumnFormat('0', { columnType: 'FORMULA_DATETIME' })).to.equal('Jan 1, 1970 00:00:00');
  });
});
describe('When column type is SOURCE:', () => {
  it('Should be throw an error.', () => {
    expect(() => applyColumnFormat('0', { columnType: 'SOURCE' })).to.throw();
  });
});
describe('When column type is AGGREGATION_SOURCE:', () => {
  it('Should be return itself.', () => {
    expect(applyColumnFormat('0', { columnType: 'AGGREGATION_SOURCE' })).to.equal('0');
  });
});
describe('When column type is DURATION:', () => {
  it('Should be return time span with customize intervals.', () => {
    expect(applyColumnFormat('0', { columnType: 'DURATION', formatting: { interval: ['second'] } })).to.equal('0 second');
  });
});
describe('When column type is FORMULA_DURATION:', () => {
  it('Should be return itself.', () => {
    expect(applyColumnFormat('0', { columnType: 'FORMULA_DURATION', formatting: { interval: ['second'], decimalPlaces: 2 } })).to.equal('0.00 second');
  });
});
describe('When column type is DURATION and with minus:', () => {
  it('Should be return itself.', () => {
    expect(applyColumnFormat('-1', { columnType: 'DURATION', formatting: { interval: ['second'], decimalPlaces: 2 } })).to.equal('-1 second');
  });
});
describe('When column type is FORMULA_DURATION and with minus:', () => {
  it('Should be return itself.', () => {
    expect(applyColumnFormat('-100', { columnType: 'FORMULA_DURATION', formatting: { interval: ['second'], decimalPlaces: 2 } })).to.equal('-(0.10 second)');
  });
});

