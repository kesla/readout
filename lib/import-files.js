var fs = require('fs')
  , path = require('path')

  , async = require('async')
  , jsonmark = require('jsonmark')

  , example = require('./example')

  , packageJson = function(dir, callback) {
      fs.readFile(path.join(dir, 'package.json'), 'utf8', function(err, packageJson) {
        if (err)
          callback(err)
        else
          callback(null, JSON.parse(packageJson))
      })
    }
  , travis = function(dir, callback) {
      fs.exists(path.join(dir, '.travis.yml'), function(exists) {
        callback(null, exists)
      })
    }
  , license = function(dir, callback) {
      fs.readdir(dir, function(err, files) {
        var fileName

        if (err)
          callback(err)
        else {
          fileName = files.filter(function(fileName) {
            return path.basename(fileName, '.md').toLowerCase() === 'license'
          })[0]

          if (!fileName)
            callback(null, null)
          else
            fs.readFile(path.join(dir, fileName), 'utf8', callback)
        }
      })
    }
  , baseReadme = function(dir, callback) {
      fs.readdir(dir, function(err, files) {
        var fileName

        if(err)
          callback(err)
        else {
          fileName = files.filter(function(fileName) {
            return path.basename(fileName, '.md').toLowerCase() === 'readme'
          })[0]

          if (!fileName)
            callback(null, {
                order: []
              , content: {}
            })
          else
            fs.readFile(path.join(dir, fileName), 'utf8', function(err, file) {
              if (err)
                callback(err)
              else
                callback(null, jsonmark.parse(file))
            })
        }
      })
    }

  , importFiles = function(dir, callback) {
      async.parallel({
          packageJson: packageJson.bind(null, dir)
        , travis: travis.bind(null, dir)
        , example: example.bind(null, dir)
        , license: license.bind(null, dir)
        , baseReadme: baseReadme.bind(null, dir)
      }, callback)
    }

module.exports = importFiles