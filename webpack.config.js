const path = require("path");
// import path from 'path'   위에거라 같은거.
// 하지만 웹팩콘피그는 모던 자바스크립트 파일이 아니라서
// import 라는 걸 쓸 수 없음.

const autoprefixer = require("autoprefixer");

const ExtractCSS = require("extract-text-webpack-plugin");

const MODE = process.env.WEBPACK_ENV;

// __dirname은 현재 프로젝트 디렉토리 이름,
// 이건 어디서든 접근 가능한 Node.js  전역변수임.
// 그담에 entry 파일 경로를 쭉 씀.
const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");

// output_dir은 디렉토리니까 path.join을 쓰고
// 'static'이라는 폴더로 보내라(export)고 할 거임.
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  entry: ["@babel/polyfill", ENTRY_FILE],
  mode: MODE,
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.(scss)$/,
        use: ExtractCSS.extract([
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => {
                return [autoprefixer({ Browserslist: "cover 99.5%" })];
              }
            }
          },
          {
            loader: "sass-loader"
          }
        ])
      }
    ]
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js"
  },
  plugins: [new ExtractCSS("styles.css")]
};

module.exports = config;
