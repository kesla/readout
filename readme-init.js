var fs = require('fs')
  , path = require('path')

  , async = require('async')
  , mit = require('mit')
  , githubUrl = require('github-url')
  , jsonmark = require('jsonmark')

  , createReadme = function(options) {
      var packageJson = options.packageJson
        , github = githubUrl(packageJson.repository)
        , repo = github? github.user + '/' + github.project : false
        , travis = ''
        , parsedReadme = options.baseReadme
        , name = options.packageJson.name

      if (repo && options.travis)
        travis = [
            '[![build status](https://secure.travis-ci.org/'
          , repo
          , '.png)]'
          , '(http://travis-ci.org/'
          , repo
          , ')'
        ].join('')

      parsedReadme.order[0] = name + travis
      parsedReadme.content[name + travis] = {
          head: '# ' + name + travis
        , body: packageJson.description
      }

      parsedReadme.order[1] = 'Installation'
      parsedReadme.content['Installation'] = {
          head: '## Installation'
        , body: [
              '```'
            , 'npm ' + (packageJson.preferGlobal? '-g ' : '') + 'install ' +
                packageJson.name
            , '```'
          ].join('\n')
      }

      if (options.example) {
        parsedReadme.order.push('Example')
        parsedReadme.content['Example'] = {
            head: '## Example'
          , body: [
                '```javascript'
              , options.example
              , '```'
            ].join('\n')
        }
      }

      if (options.licence) {
        parsedReadme.order.push('Licence')
        parsedReadme.content['Licence'] = {
            head: '## Licence'
          , body: options.licence.trim()
        }
      }

      return jsonmark.stringify(parsedReadme) + '\n'
    }
  , importFiles = function(dir, callback) {
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
                  return path.basename(fileName, '.md').toLowerCase() === 'licence'
                })[0]

                if (!fileName)
                  done(null, null)
                else
                  fs.readFile(path.join(dir, fileName), 'utf8', done)
              }
            })
          }
        , baseReadme: function(done) {
            fs.readdir(dir, function(err, files) {
              var fileName

              if(err)
                done(err)
              else {
                fileName = files.filter(function(fileName) {
                  return path.basename(fileName, '.md').toLowerCase() === 'readme'
                })[0]

                if (!fileName)
                  done(null, {
                      order: []
                    , content: {}
                  })
                else
                  fs.readFile(path.join(dir, fileName), 'utf8', function(err, file) {
                    if (err)
                      done(err)
                    else
                      done(null, jsonmark.parse(file))
                  })
              }
            })
          }

      }, callback)
    }

module.exports = function(dir, callback) {
  importFiles(dir, function(err, options) {
    if (err)
      callback(err)
    else
      callback(null, createReadme(options))
  })
}