# Webpack
웹팩은 자바스크립트를 최적화하여 번들파일을 생성해준다.  
이때 babel(ES6문법을 ES5로 번역)과 css, json 그리고 이미지 파일까지도 하나의 js파일로 생성한다.

# 웹팩 설치
- webpack
- webpack-cli
- webpack-dev-server

```bash
yarn add --dev webpack webpack-cli webpack-dev-server
```

## webpack 설정

#### webpack.config.js 파일을 생성
이름은 임의로 지정가능
```js
module.exports = {
  entry: [ // 번역 대상 파일을 지정할 수 있다.
    './src/index.js'
  ],
  output: {
    path: __dirname + '/build', // 출력대상 path
    publicPath: '/',
    filename: 'bundle.js' // 출력 파일 명
  },
  devServer: { // 개발환경에서 사용할 폴더
    contentBase: './build',
    port: 3000 // 개발서버 포트
  }
};
```

#### index.html 파일 생성

출력 디렉터리에 빌드 되므로 읽어서 개발 서버에서 사용할 html 파일을 생성한다.   
출력 폴더가 build 일때 ./build/index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <title>React Webpack Babel Setup</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>
```
#### package.json 수정
파일을 생성했다면 package.json 파일에 다음 내용을 추가 한다. 
```json
"scripts": {
    "start": "webpack-dev-server --config webpack.config.js --mode development",
    "build": "webpack --mode production -w"
  },
```
- "start"는 webpack.config.js 의 설정으로 development 모드로 개발서버를 실행한다.
- "build"는 production 모드로 빌드하여 ./build/bundle.js 파일을 생성한다.

# 바벨 설치
- babel-core
- babel-loader
- babel-preset-env
- babel-preset-react
- babel-preset-stage-2

```bash
yarn add --dev babel-core babel-loader babel-preset-env babel-preset-react babel-preset-stage-2
```

## 바벨 설정
#### .babelrc 파일을 생성하고 번역 프리셋을 설정한다.
```js
{
  "presets": [ 
    "env", 
    "react",
    "stage-2"
  ]
}
```

#### webpack.config.js에 module 추가

webpack.config.js 
```js
module.exports = {
  entry: [ 
    './src/index.js'
  ],
  output: {
    path: __dirname + '/build', 
    publicPath: '/',
    filename: 'bundle.js' 
  },
  module: { // 번역 모듈을 등록한다.
    rules: [
      { // 바벨에 대한 설정
        test: /\.(js|jsx)$/, // js 또는 jsx 파일
        exclude: /node_modules/, // 제외 항목
        use: ['babel-loader'] // babel-loader를 사용
      },
    ]
  },
  devServer: {
    contentBase: './build',
    port: 3000
  }
};
```

# React 및 HMR(Hot Module Replace) 설치
- react
- react-dom
- react-hot-loader
```bash
yarn add --dev react-hot-loader
yarn add react react-dom
```

## HMR 설정
### webpack.config.js 파일 수정
```js
const webpack = require('webpack'); // 플러그인 사용을 위해 모듈을 불러온다.

module.exports = {
  entry: [ 
    'react-hot-loader/patch', // 진입점에도 추가
    './src/index.js' 
  ],
  output: { 
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
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // HMR 플러그인 추가
  ],
  devServer: {
    contentBase: './build',
    port: 3000,
    hot : true // 개발서버에서 HMR 사용
  }
};
```

#### HMR 사용을 위한 index.js 수정
```js
import React from 'react';
import ReactDOM from 'react-dom';
 
const title = 'React Webpack Babel ㅗ Setup';
 
ReactDOM.render(
  <div>{title}</div>,
  document.getElementById('root')
);

module.hot.accept(); // HMR 을 사용하기 위해 이 코드를 추가 합니다.
```

# concurrently
node의 여러 명령을 사용하기 편하게 해줍니다.
여러 파일을 추가로 빌드 할수 있습니다.
```
yarn add concurrently
```
다음과 같은 형식으로 여러 명령을 한번에 실행한다.
```js
"scripts": {
  "start:dev" : "concurrently \"webpack --watch --config webpack.config.js --mode development\" \"webpack-dev-server\" "
}
```

# 기타 파일 번들링
webpack.config.js 의 `module.rule` 배열에 포함시킵니다.

# CSS
- css-loader
- style-loader
- mini-css-extract-plugin : style 태그로 넣는것을 css로 추출하는 플러그인

css 파일은 `import './app.css';` 형태로 불러올 수 있습니다.

```
yarn add --dev css-loader style-loader mini-css-extract-plugin
```

상단에 모듈을 불러옵니다.
```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production' // 개발서버인지 판별
```
`module.rule`에 다음과 같이 추가 하고
```js
{
  test: /\.css$/,
  use: [
    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader',
  ],
}
```
`plugins` 에 추가 합니다.
```js
new MiniCssExtractPlugin({ filename: devMode ? '[name].css' : '[name].[hash].css' })
```
build 시 `NODE_ENV=production` 값 설정을 해야 합니다.  
`cross-env`는 window 환경에서 필요함
```
"build": "cross-env NODE_ENV=production webpack --mode production -w",
```

# JSON
- json-loader
```
yarn add --dev json-loader
```
`module.rule`에 다음과 같이 추가
```js
{
  test: /\.json$/,
  loader: 'json-loader'
}
```

# 이미지 및 기타 파일 로더
- url-loader : 설정한 크기보다 작으면 base64로 인코딩하여 포함합니다.
- file-loader : url-loader에서 설정한 크기보다 크면 이것을 기본으로 사용합니다.

```
yarn add --dev url-loader file-loader
```

파일은 `import img from './image.png'` 형식으로 불러올 수 있습니다.

`module.rule`에 다음과 같이 추가
```js
{
  test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  loader: 'url-loader',
  options: {
    limit: 10240, // 10kb보다 작으면 인라인
    name: '[path][name].[hash].[ext]',
    outputPath: 'images/' // 출력될때 저장될 폴더
  },
}
```