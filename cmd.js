#!/usr/bin/env node

var fs = require('fs')

  , createReadme = require('./readout')

  , fileName = process.argv[2]

createReadme(process.cwd(), function(err, readme) {
  if (err)
    throw err
  console.log(readme)

  if (fileName) {
    fs.writeFile(fileName, readme, function(err) {
      if (err)
        throw err

      console.log(fileName + ' written')
    })
  }
})
