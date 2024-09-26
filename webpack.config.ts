/// <reference types="webpack-dev-server" />
import { CleanWebpackPlugin as CleanPlugin } from 'clean-webpack-plugin'
import CSPHTMLPlugin from 'csp-html-webpack-plugin'
import HTMLPlugin from 'html-webpack-plugin'
import path from 'path'
import type { Configuration } from 'webpack'
import { emitAssetLinks } from './scripts/asset-links'
import { emitHeaders } from './scripts/headers'
import { emitRedirects } from './scripts/redirects'
import { emitRobotsTXT } from './scripts/robots'

const ASSETS_FILE = path.join(__dirname, 'assets')
const asset = (...paths: string[]) => path.join(ASSETS_FILE, ...paths)

const configure: Configuration = {
  context: __dirname,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [require.resolve('babel-loader'), require.resolve('ts-loader')],
      },
      {
        type: 'asset/inline',
        include: [path.join(__dirname, 'src', 'components', 'assets')],
      },
    ],
  },
  plugins: [
    new HTMLPlugin({
      title: 'eSIM QRCode Portal',
      favicon: asset('favicon.png'),
      template: asset('template.ejs'),
      inject: 'body',
      meta: buildMeta({
        description: 'This is the eSIM QRCode portal page',
        viewport: { 'width': 'device-width', 'initial-scale': 1.0 },
        robots: ['noindex', 'nofollow'],
        google: ['notranslate', 'nopangereadaloud'],
      }),
    }),
    new CSPHTMLPlugin({
      'style-src': ["'unsafe-inline'"],
      'img-src': ["'self'", 'blob:', 'data:'],
    }),
    new CleanPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'dist')],
    }),
    emitAssetLinks(),
    emitRedirects(),
    emitHeaders(),
    emitRobotsTXT(),
  ],
  devServer: {
    server: 'https',
    compress: true,
    hot: false,
    liveReload: false,
    client: false,
    historyApiFallback: {
      rewrites: [{ from: /./, to: '/index.html' }],
    },
  },
}

function buildMeta(records: Record<string, string | string[] | object>) {
  const entries = Object.entries(records).map(([name, value]): [string, string] => {
    if (Array.isArray(value)) {
      value = value.join(',')
    } else if (typeof value === 'object') {
      value = Object.entries(value)
        .map((entry) => entry.join('='))
        .join(',')
    }
    return [name, value]
  })
  return Object.fromEntries(entries)
}

export default configure
