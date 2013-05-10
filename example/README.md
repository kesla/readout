# example[![build status](https://secure.travis-ci.org/kesla/example.png)](http://travis-ci.org/kesla/example)

An example module to show how to autogenerate a README.md-file. The code implements addition.

## Installation

```
npm install example
```

## Example

```javascript
var addition = require('./addition')

console.log('1 + 2 = %s', addition(1, 2))
console.log('1 + (-1) = %s', addition(1, -1))
```

## Licence

MIT