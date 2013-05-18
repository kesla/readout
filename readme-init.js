var fs = require('fs')
  , path = require('path')

  , async = require('async')
  , mit = require('mit')
  , githubUrl = require('github-url')

function createReadme(options) {
  var packageJson = options.packageJson
    , github = githubUrl(packageJson.repository)
    , repo = github? github.user + '/' + github.project : false
    , travis = ''
    , output = []

  if (repo && options.travis)
    travis = [
        '[![build status](https://secure.travis-ci.org/'
      , repo
      , '.png)]'
      , '(http://travis-ci.org/'
      , repo
      , ')'
    ].join('')

  output.push('# ' + options.packageJson.name + travis)
  output.push(packageJson.description)

  output.push('## Installation')
  output.push(
      [
          '```'
        , 'npm ' + (packageJson.preferGlobal? '-g ' : '') + 'install ' +
            packageJson.name
        , '```'
      ].join('\n')
  )

  if (options.example) {
    output.push('## Example')
    output.push(
      [
          '```javascript'
        , options.example
        , '```'
      ].join('\n')
    )
  }

  if(options.licence) {
    output.push('## Licence')
    output.push(options.licence.trim())
  }

  return output.join('\n\n') + '\n'
}

module.exports = function(dir, callback) {
  async.parallel({
          packageJson: function(done) {
            fs.readFile(path.join(dir, 'package.json'), 'utf8', function(err, packageJson) {
              if (err)
                done(err)
              else
                done(null, JSON.parse(packageJson))
            })
          }
        , travis: function(done) {
            fs.exists(path.join(dir, '.travis.yml'), function(exists) {
              done(null, exists)
            })
          }
        , example: function(done) {
            fs.exists(path.join(dir, 'example.js'), function(exists) {
              if (!exists) {
                done(null, false)
              } else {
                fs.readFile(path.join(dir, 'example.js'), 'utf8', done)
              }
            })
          }
        , licence: function(done) {
            fs.readdir(dir, function(err, files) {
              var fileName
              if (err)
                done(err)
              else {
                fileName = files.filter(function(fileName) {
                  return path.basename(fileName, 'md').toLowerCase() === 'licence'
                })[0]
                if (!fileName)
                  done(null, null)
                else
                  fs.readFile(path.join(dir, fileName), 'utf8', done)
              }
            })
          }
      }
    , function(err, obj) {
        if (err)
          callback(err)
        else
          callback(null, createReadme(obj))
      }
  )

}