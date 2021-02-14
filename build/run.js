const webpack = require('webpack');
const childProcess = require('child_process');
const path = require('path');
const webpackConfig = require('./dev.conf');

const compiler = webpack(webpackConfig);

let outputProcess = null;

compiler.plugin('done', (stats) => {
	if (stats.hasErrors()) {
		console.log(stats.compilation.errors.join('\n')); // eslint-disable-line no-console, local-rules/custom-logs
		return;
	}
	if (outputProcess !== null) {
		outputProcess.kill('SIGKILL');
		outputProcess = null;
	}
	if (outputProcess === null) {
		const outputDirectory = stats.compilation.compiler.outputPath;
		const outputFile = stats.toJson().assetsByChunkName.main;
		const out = Array.isArray(outputFile) ? outputFile[0] : outputFile;

		if (!outputFile) {
			throw new Error('Chunk has no assets');
		}

		const outputPath = path.join(outputDirectory, out);
		outputProcess = childProcess.fork(outputPath, {
			execArgv: ['--inspect=0']
		});
	}
});

process.on('beforeExit', () => {
	if (outputProcess !== null) {
		outputProcess.kill('SIGKILL');
	}
});

compiler.watch({}, (error) => {
	if (error) {
		throw error;
	}
});
