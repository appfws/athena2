const path = require('path')
const webpack = require('webpack')

const Util = require('../util')

const autoprefixerConf = require('./autoprefixer.conf')

module.exports = function (appPath, buildConfig, template, platform, framework) {
  const { env = {}, defineConstants = {} } = buildConfig
  return {
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.js|jsx$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    cacheDirectory: true,
                    presets: [
                      [require('babel-preset-env'), {
                        targets: {
                          browsers: autoprefixerConf[platform],
                          uglify: true,
                          loose: false,
                          useBuiltIns: true
                        }
                      }]
                    ],
                    plugins: [].concat(
                      platform === 'pc' ? [
                        require('babel-plugin-transform-es3-member-expression-literals'),
                        require('babel-plugin-transform-es3-property-literals')
                      ] : []
                    ).concat(
                      framework === 'nerv' ? [
                        [require('babel-plugin-transform-react-jsx'), {
                          pragma: 'Nerv.createElement'
                        }]
                      ] : []
                    ).concat(
                      framework === 'react' ? [
                        [require('babel-plugin-transform-react-jsx')]
                      ] : []
                    )
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    resolve: {
      modules: [path.join(Util.getRootPath(), 'node_modules'), 'node_modules'],
      alias: {
        '@APP': appPath
      }
    },
    resolveLoader: {
      modules: [path.join(Util.getRootPath(), 'node_modules'), 'node_modules']
    },
    plugins: [
      new webpack.DefinePlugin(Object.assign({
        'process.env': env
      }, defineConstants))
    ]
  }
}