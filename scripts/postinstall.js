const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const chalk = require('chalk');

const scripts = ['pre-commit.sh'];

function resolve(dir) {
	return path.join(__dirname, dir);
}

const localHooks = resolve('git/hooks');
const deployedHooks = resolve('../.git/hooks');

scripts.forEach((fileName) => {
	const distName = fileName.replace('.sh', '');
	fsExtra.copySync(path.join(localHooks, fileName), path.join(deployedHooks, distName));
	fs.chmodSync(path.join(deployedHooks, distName), '755');
	/* eslint-disable */
	console.log(chalk.cyan(`Deploying git hook "${fileName}"`));
	/* eslint-enable */
});
