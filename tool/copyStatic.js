const dir = './build/client'
require('shelljs').mkdir('-p', dir)
require('shelljs').cp('-rf', './src/static/*', dir)
