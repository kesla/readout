#!/usr/bin/env node

var fs = require('fs')
  , mit = require('mit')
  , github
  , path = require('path')
  , dir = process.cwd()
  , output = []
  , packageJson = require(path.join(dir, 'package.json'))
  , idx = 0
  , example = false
  , github = require('github-url')(packageJson.repository)
  , repo = false
  , travis = false
  , licence = packageJson.licence

if (github)
  repo = github.user + '/' + github.project

if (fs.existsSync(path.join(dir, 'example.js')))
  example = fs.readFileSync(path.join(dir, 'example.js'), 'utf8')

if (github && fs.existsSync(path.join(dir, '.travis.yml'))){
  travis = [
      '[![build status](https://secure.travis-ci.org/'
    , repo
    , '.png)]'
    , '(http://travis-ci.org/'
    , repo
    , ')'
  ].join('')
}

//
// take name from packageJson
// take description from packageJson

if (travis)
  output.push('# ' + packageJson.name + travis)
else
  output.push('# ' + packageJson.name)

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

if (example) {
  output.push('## Example')
  output.push('```javascript\n' + example + '\n```')
}

if (licence) {
  output.push('## Licence')
  if (licence.toLowerCase().trim() === 'mit')
    output.push(mit(packageJson.author.split(' <')[0]))
  else
    output.push(licence)
}

output = output.join('\n\n')

fs.writeFileSync(path.join(dir, 'README.md'), output)
console.log(output)