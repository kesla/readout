var fs = require('fs')
  , path = require('path')

  , async = require('async')
  , githubUrl = require('github-url')
  , jsonmark = require('jsonmark')

  , importFiles = require('./lib/import-files')

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

      if (parsedReadme.order.indexOf('Installation') === -1)
        parsedReadme.order.splice(1, 0, 'Installation')

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
        if (parsedReadme.order.indexOf('Example') === -1) {
          parsedReadme.order.splice(
              parsedReadme.order.indexOf('Installation') + 1
            , 0
            , 'Example'
          )
        }

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
        if (parsedReadme.order.indexOf('Licence') === -1)
          parsedReadme.order.push('Licence')
        parsedReadme.content['Licence'] = {
            head: '## Licence'
          , body: options.licence.trim()
        }
      }

      return jsonmark.stringify(parsedReadme) + '\n'
    }

module.exports = function(dir, callback) {
  importFiles(dir, function(err, options) {
    if (err)
      callback(err)
    else
      callback(null, createReadme(options))
  })
}