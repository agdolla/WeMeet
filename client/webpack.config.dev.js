var path = require('path');
// var webpack = require('webpack');
var HappyPack = require('happypack');

module.exports = {
  // The main "entry point" of your web app. WebPack will pack every module that
  // this file depends on (and its dependencies depend on).
  entry: './app/app.jsx',
  // Package up the application as 'app.js' in the 'build/js' directory.
  // __dirname is a magic variable that contains the directory that webpack.config.js
  // is located in.
  output: {
    path: path.resolve(__dirname, "build", "js"),
    publicPath: "/js/",
    filename: "[name].app.js",
    pathinfo: true
  },
  mode: 'development',
  // Source Maps map locations in build/js/app.js back to individual application
  // modules. Chrome Developer Tools uses this so you can see your original code
  // in the development tools.
  // We use the "inline-source-map" setting (as opposed to external source maps)
  // so this works in a foolproof way.
  devtool: 'cheap-module-source-map',
  plugins: [
    new HappyPack({
      loaders: [
        {
          loader: 'babel-loader',
          query: {
            cacheDirectory: true,
            presets: ['es2015', 'react'],
            plugins: ["transform-class-properties", "syntax-dynamic-import"]
          }
        }
      ]
    })
  ],
  module: {
    // Transforms your application's code using Babel.
    // Babel lets you use new JavaScript features in browsers that do not
    // have them. In particular, Babel lets you use JavaScript modules, which
    // are a recent addition to JavaScript that are not supported by all browsers.
    // In the future, this transformation step will not be necessary.
    // (The babel-loader will also compile your React templates to JavaScript.)
    rules: [
      {
        // Only transform *.js files.
        test: /\.jsx?$/,
        // Don't transform any of the modules you depend on -- just transform
        // *your* code.
        exclude: /(node_modules|bower_components)/,
        use: 'happypack/loader'
        // loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
      React: path.resolve(__dirname, './node_modules/react')
    },
    modules: [__dirname, './node_modules']
  },
  resolveLoader: {
    modules: [__dirname, './node_modules']
  }
};
