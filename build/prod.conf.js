const path = require('path');
const merge = require('webpack-merge');
const trim = require('lodash/trim');
const webpack = require('webpack');
const { execSync } = require('child_process');
const base = require('./base.conf');

const hash = trim(execSync('git rev-parse --short HEAD').toString());

module.exports = merge(base, {
	entry: {
		index: './src/index.js'
	},
	devtool: 'source-map',
	output: {
		path: path.join(__dirname, '..', 'dist'),
		filename: '[name].js',
		libraryTarget: 'umd'
	},
	mode: 'production',
	plugins: [
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(true),
		new webpack.DefinePlugin({
			HASH: JSON.stringify(hash)
		}),
		new webpack.IgnorePlugin(/^pg-native$/)
	]
});

module.exports.module.rules.unshift({
	test: /\.js$/,
	enforce: 'pre',
	use: [
		{
			loader: 'webpack-strip-block'
		}
	]
});
