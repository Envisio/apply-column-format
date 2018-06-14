apply-column-format

[![Inline docs](http://inch-ci.org/github/Envisio/apply-column-format.svg?branch=master&style=shields)](http://inch-ci.org/github/Envisio/apply-column-format) [![Build Status](https://travis-ci.org/Envisio/apply-column-format.svg?branch=master)](https://travis-ci.org/Envisio/apply-column-format) [![Coverage Status](https://coveralls.io/repos/github/Envisio/apply-column-format/badge.svg?branch=master)](https://coveralls.io/github/Envisio/apply-column-format?branch=master)

# Examples

```
import applyColumnFormat from 'apply-column-format';
const formattedColumn = applyColumnFormat('0', {
  columnType: 'DATE',
  formatting: {
    decimalPlaces: 0,
    interval: 'second'
  }
});
console.log(formattedColumn);
// Jan 1, 1970
```