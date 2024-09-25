/// <reference types="webpack-dev-server" />
import { CleanWebpackPlugin as CleanPlugin } from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import HTMLPlugin from 'html-webpack-plugin'
import CSPHTMLPlugin from 'csp-html-webpack-plugin'
import path from 'path'
import type { Configuration } from 'webpack'
import { emitFile } from '@nice-labs/emit-file-webpack-plugin'
import { assetLinks } from './scripts/asset-links'

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
    new CopyPlugin({
      patterns: [
        { from: asset('robots.txt'), to: 'robots.txt', toType: 'file' },
        { from: asset('cf-headers.txt'), to: '_headers', toType: 'file' },
        { from: asset('cf-redirects.txt'), to: '_redirects', toType: 'file' },
      ],
    }),
    emitFile({
      name: '.well-known/assetlinks.json',
      content() {
        return JSON.stringify(assetLinks)
      },
    }),
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
