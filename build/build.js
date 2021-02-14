const chalk = require('chalk');
const path = require('path');
const rm = require('rimraf');
const webpack = require('webpack');
const webpackConfig = require('./prod.conf');

rm(path.join(path.resolve(__dirname, '../dist')), (err) => {
	if (err) throw err;
	webpack(webpackConfig, (e, stats) => {
		if (e) throw e;
		process.stdout.write(
			`${stats.toString({
				colors: true,
				modules: false,
				children: false,
				chunks: false,
				chunkModules: false
			})}\n\n`
		);

		if (stats.hasErrors()) {
			console.log(chalk.red('  Build failed with errors.\n')); // eslint-disable-line no-console, local-rules/custom-logs
			process.exit(1);
		}

		console.log(chalk.cyan('  Build complete.\n')); // eslint-disable-line no-console, local-rules/custom-logs
	});
});
