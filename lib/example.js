var fs = require('fs')
  , path = require('path')

  , example = function(dir, done) {
      fs.exists(path.join(dir, 'example.js'), function(exists) {
        if (!exists) {
          done(null, false)
        } else {
          fs.readFile(
              path.join(dir, 'example.js')
            , 'utf8'
            , function(err, file) {
                if (err)
                  done(err)
                else
                  done(err, file.trim())
              }
          )
        }
      })
    }

module.exports = example