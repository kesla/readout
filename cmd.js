#!/usr/bin/env node

var createReadme = require('./readout')

createReadme(process.cwd(), function(err, readme) {
  if (err)
    throw err
  console.log(readme)
})
