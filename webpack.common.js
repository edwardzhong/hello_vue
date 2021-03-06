const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/main.ts',
  output: {
    path: resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name]-[hash].js', //输出文件添加hash
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.vue', '.js', '.json'],
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    runtimeChunk: 'single',
    splitChunks: {
      minSize: 100000,
      maxSize: 300000,
      cacheGroups: {
        vue: {
          test: /[\\/]node_modules[\\/](vue|vuex|vue-router)[\\/]/,
          chunks: 'initial',
          priority: 10,
          name: 'base',
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'async',
          priority: 9,
          minChunks: 2,
          name: 'vendors',
        },
        // common: {
        // 	name: 'common',
        // 	chunks: 'initial',
        // 	priority: 2,
        // 	minChunks: 2,
        // },
        styles: {
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
          priority: 20,
          name: 'styles',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: ['vue-loader'],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: { appendTsSuffixTo: [/\.vue$/] },
          },
        ],
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: ['babel-loader'], //'eslint-loader'
      },
      {
        test: /\.pug$/,
        use: ['pug-plain-loader'],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode,
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode,
            },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [resolve(__dirname, 'src/variables.scss')],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: 'img/[name].[ext]'
            },
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: 'font/[name].[ext]'
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(), //生成新文件时，清空生出目录
    new HtmlWebpackPlugin({
      template: './public/index.html', //模版路径
      filename: 'index.html', //生成后的文件名,默认index.html
      favicon: './public/favicon.ico',
      minify: {
        removeAttributeQuotes: true,
        removeComments: true,
        collapseWhitespace: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      ignoreOrder: true,
    }),
    new HotModuleReplacementPlugin(), //HMR
  ],
};
