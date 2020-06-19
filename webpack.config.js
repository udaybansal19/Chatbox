var path = require('path');

module.exports = {
  mode: 'development',
  entry: './Src/index.js',
  output: {
    path: path.resolve(__dirname, 'Conf'),
    filename: 'main.bundle.js'
  }
};