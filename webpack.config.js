const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production' // 개발서버인지 판별

console.log("devMode : " + devMode);

module.exports = {
  entry: [ // 시작
    'react-hot-loader/patch',
    './src/index.js' 
  ],
  output: { // 출력설정
    path: __dirname + '/build', 
    publicPath: '/',
    filename: 'bundle.js' 
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
          limit: 10240, // 10kb보다 작으면 인라인
          name: '[path][name].[hash].[ext]',
          outputPath: 'images/', // 출력될때 저장될 폴더
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({ filename: devMode ? '[name].css' : '[name].[hash].css' })
  ],
  devServer: { // 개발서버 설정
    contentBase: './build',
    port: 3000,
    hot : true
  }
};