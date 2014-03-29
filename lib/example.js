var fs = require('fs')
  , path = require('path')

  , async = require('async')
  , exec = require('child_process').exec

  , readFile = function(file, callback) {
      fs.exists(file, function(exists) {
        if (!exists) {
          callback(null, false)
        } else {
          fs.readFile(
              file
            , 'utf8'
            , function(err, file) {
                if (err)
                  callback(err)
                else
                  callback(err, file.trim())
              }
          )
        }
      })
    }

  , execFile = function (file, callback) {
      exec('node '  + file, function (err, stdout) {
        if (err)
          callback(err)
        else
          callback(null, stdout.trim())
      })
    }

  , example = function (dir, callback) {
      var file = path.join(dir, 'example.js')

      fs.exists(file, function (exists) {
        if (!exists)
          callback(null, false)
        else
          async.parallel({
              input: readFile.bind(null, file)
            , output: execFile.bind(null, file)
          }, callback)

      })

    }

module.exports = example