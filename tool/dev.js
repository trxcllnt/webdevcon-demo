'use strict' // eslint-disable-line


/**
 * Dependencies
 */
const path = require('path')

// get the last argument
// possible values:
// null - run client (browser) and server
// all - run client (brower), server and cordova
// cordovaOnly - run only cordova
const argv = process.argv[2]

const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const clientConfig = require('./webpack.config.js').clientConfig
const serverConfig = require('./webpack.config.js').serverConfig

const commonLoaders = [
  { test: /\.css$/, loader: ExtractTextPlugin.extract('css?module&localIdentName=[local]_[hash:6]!postcss') },
]

const commonPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    __DEV__: true,
    'process.env.NODE_ENV': '"development"',
  }),
  new ExtractTextPlugin('styles.css', { allChunks: true }), // has to use this for universal server client rendering
]


/**
 * Client
 */

clientConfig.devtool = 'cheap-module-eval-source-map'
clientConfig.devtool = 'inline-source-map';
// add hot middleware on port 8080
clientConfig.entry.client.push('webpack-hot-middleware/client?path=http://localhost:8080/__webpack_hmr&overlay=false&reload=true&noInfo=true&quiet=true')
clientConfig.output.filename = 'index.js'
clientConfig.module.loaders.push(
  ...commonLoaders
)

clientConfig.plugins.push(
  ...commonPlugins
)

const clientCompiler = webpack(clientConfig)

let clientStarted = false
;(argv !== 'cordovaOnly') && clientCompiler.watch({}, (err, stats) => { // eslint-disable-line no-unused-expressions
  console.log('Client Bundles \n', stats.toString({ chunkModules: false, colors: true }), '\n')
  // console.log('Client Bundles \n',stats.toString({colors:true}),'\n')

  if (clientStarted) return
  // the build/webpack-assets.json is ready, so go on create the server bundle
  createServer()
  clientStarted = true
})


// use inbuilt http module
require('http').createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  require('webpack-hot-middleware')(clientCompiler, { log: false })(req, res)
}).listen(8080)


/**
 * Server
 */
serverConfig.devtool = 'cheap-module-eval-source-map'
serverConfig.devtool = 'inline-source-map';

// allow hot module on server side
serverConfig.entry.server.push(__dirname + '/signal.js?hmr')  // hmr is the signal to re load
serverConfig.module.loaders.push(
  ...commonLoaders
)

serverConfig.plugins.push(
  ...commonPlugins
)


function createServer() {
  let child

  webpack(serverConfig).watch({}, (err, stats) => {
    console.log('Server Bundle \n', stats.toString({ colors: true }), '\n')
    if (stats.hasErrors()) return 1
    if (child) return child.send('hmr')
    createChild()
  })

  function createChild() {
    child = require('child_process').fork(path.join(serverConfig.output.path, serverConfig.output.filename))
    const start = Date.now()
    child.on('exit', (code, signal) => {
      console.error('Child server exited with code:', code, 'and signal:', signal)
      child = null
      if (!code) return
      if (Date.now() - start > 1000) createChild() // arbitrarily only after the server has started for more than 1 sec
    })
  }
}

/**
 * Cordova
 */
const cordovaConfig = require('./webpack.config.js').cordovaConfig

cordovaConfig.devtool = 'cheap-module-eval-source-map'
cordovaConfig.devtool = 'inline-source-map';
cordovaConfig.module.loaders.push(
  ...commonLoaders
)

cordovaConfig.plugins.push(
  ...commonPlugins
)

// remove the new webpack.HotModuleReplacementPlugin(),
cordovaConfig.plugins = cordovaConfig.plugins.filter(p => !(p instanceof webpack.HotModuleReplacementPlugin))

;(argv === 'all' || argv === 'cordovaOnly') && webpack(cordovaConfig).watch({}, (err, stats) => { // eslint-disable-line no-unused-expressions
  console.log('Cordova Bundles \n', stats.toString({ chunkModules: false, colors: true }), '\n')
})
