const path = require('path');
const fs = require('fs');

const resolve = (dir) => fs.realpathSync(path.join(__dirname, '..', dir));

module.exports = {
	resolve: {
		extensions: ['.js', '.json'],
		alias: {
			'@': resolve('src')
		}
	},
	target: 'node',
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('src')]
			}
		]
	},
	node: {
		process: false
	}
};
