const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const base = require('./base.conf');

module.exports = merge(base, {
	entry: ['./src/index.js'],
	target: 'node',
	output: {
		path: path.join(__dirname, '..', '.temp'),
		filename: 'index.js',
		libraryTarget: 'umd'
	},
	devtool: '#source-map',
	mode: 'development',
	plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()],
	externals: [nodeExternals()]
});
