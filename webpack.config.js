const WebpackShellPlugin = require('webpack-shell-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FilewatcherPlugin = require("filewatcher-webpack-plugin");

const plugins = [
  new ExtractTextPlugin('underwear.unminified.css'),
  new WebpackShellPlugin({ onBuildExit: ['node build.js'] }),
  new FilewatcherPlugin({
    watchFileRegex: ['src/index.html']
  })
];

const pluginsWithMinification = [
  new ExtractTextPlugin('underwear.css'),
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessor: require('cssnano'),
    cssProcessorOptions: { discardComments: { removeAll: true } },
    canPrint: true
  })
];

const config = {
  entry: './index.js',
  output: {
    filename: './bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: './fonts/[name].[ext]'
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  }
};

const configUnminified = { ...config, plugins };
const configMinified = { ...config, plugins: pluginsWithMinification };

module.exports = [configUnminified, configMinified];
