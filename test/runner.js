var fs = require('fs')
  , path = require('path')

  , test = require('tape')
  , readmeCreator = require('../readout.js')

  , runTest = function(name) {
      var dir = path.join(__dirname, name)
        , expected = fs.readFileSync(path.join(dir, 'expected.md'), 'utf8')

      test(name, function(t) {
        readmeCreator(dir, function(err, actual) {
          t.notOk(err, 'readmeCreator() should not error')
          t.equal(actual.trim(), expected.trim(), 'should create a Readme.md')
          t.end()
        })
      })
    }

runTest('simple')
runTest('prefer-global')
runTest('travis')
runTest('with-example')
runTest('licence')
runTest('missing-installation')
runTest('example-after-installation')
runTest('update')