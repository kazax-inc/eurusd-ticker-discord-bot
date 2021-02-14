import '@/env';
import config from '@/config';
import colors from '@/constants/colors';
import DiscordService from '@/services/discordService';
import TickerService from '@/services/tickerService';
import logger from '@/tools/logger';
import { isNil } from 'lodash';

if (config.botToken === '' || config.botToken === '') {
	logger.error({
		file: 'index.js',
		method: 'init',
		message: 'Config Missing!'
	});
	process.exit(1);
}
const bot = new DiscordService(config.botToken);
const ticker = new TickerService(config.exchange);

const _getTicker = async (callback) => {
	try {
		let embed = null;
		const price = await ticker.getTicker();

		if (!isNil(price)) {
			const lastPrice = ticker.getLastPrice();
			let color = colors.green;
			if (!isNil(lastPrice) && price < lastPrice) {
				color = colors.red;
			}

			embed = DiscordService.makeEmbed(`${ticker.getExchange().toUpperCase()} - EUR/USD`, color, [
				{ name: 'Price', value: `${price}` }
			]);
		} else {
			embed = DiscordService.makeEmbed(
				`${ticker.getExchange().toUpperCase()} - EUR/USD`,
				colors.red,
				[{ name: 'Price', value: 'NO PRICE' }]
			);
		}
		callback.channel.send(embed);
	} catch (error) {
		logger.error({
			file: 'index.js',
			method: '_getTicker',
			message: error
		});
		const embed = DiscordService.makeEmbed(
			`${ticker.getExchange().toUpperCase()} - EUR/USD`,
			colors.red,
			[{ name: 'ERROR', value: `${error}` }]
		);
		callback.channel.send(embed);
		throw error;
	}
};

const _setExchange = (ex, callback) => {
	let embed = null;
	const exchange = ticker.setExchange(ex);
	if (!isNil(exchange)) {
		embed = DiscordService.makeEmbed(`Exchange set to: ${exchange.toUpperCase()}`, colors.green);
	} else {
		embed = DiscordService.makeEmbed(`Unsuported Exchange: ${ex}`, colors.red);
	}
	callback.channel.send(embed);
};

const _getExchange = (callback) => {
	const exchange = ticker.getExchange();
	const embed = DiscordService.makeEmbed(`Exchange is: ${exchange.toUpperCase()}`, colors.green);
	callback.channel.send(embed);
};

const _unsupportedCommand = (command, callback) => {
	const embed = DiscordService.makeEmbed(`Unsuported Command: ${command}`, colors.red);
	callback.channel.send(embed);
};

export default (() => {
	try {
		bot.client.on('message', async (message) => {
			if (message.author.bot || !message.content.startsWith(config.prefix)) return;

			const commandBody = message.content.slice(config.prefix.length);
			const args = commandBody.split(' ');
			const command = args.shift().toLowerCase();

			switch (command) {
				case config.command:
					_getTicker(message);
					break;
				case 'setexchange':
					_setExchange(message, args[0]);
					break;
				case 'exchange':
					_getExchange(message);
					break;
				default:
					_unsupportedCommand(message, command);
					break;
			}
		});

		bot.login();
	} catch (error) {
		logger.error({
			file: 'index.js',
			method: 'main',
			message: error
		});
	}
})();
