const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const base = require('./base.conf');

module.exports = merge(base, {
	target: 'node',
	output: {
		path: path.join(__dirname, '..', '.temp'),
		filename: 'index.js',
		libraryTarget: 'umd'
	},
	devtool: '#eval-source-map',
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.IgnorePlugin(/^pg-native$/)
	]
});
