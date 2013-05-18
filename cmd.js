#!/usr/bin/env node

var createReadme = require('./readme-init')

createReadme(process.cwd(), function(err, readme) {
  if (err)
    throw err
  console.log(readme)
})
