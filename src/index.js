import '@/env';
import config from '@/config';
import DiscordService from '@/services/discordService';
import TickerService from '@/services/tickerService';
import logger from '@/tools/logger';
import { isNil } from 'lodash';

const bot = new DiscordService(config.botToken);
const ticker = new TickerService(config.exchange);

const _getTicker = async (callback) => {
	try {
		let embed = null;
		const price = await ticker.getTicker();

		if (!isNil(price)) {
			const lastPrice = ticker.getLastPrice();
			let color = '#2A9D8F';
			if (!isNil(lastPrice) && price < lastPrice) {
				color = '#EF5350';
			}

			embed = DiscordService.makeEmbed(`${ticker.getExchange().toUpperCase()} - EUR/USD`, color, [
				{ name: 'Price', value: `${price}` }
			]);
		} else {
			embed = DiscordService.makeEmbed(
				`${ticker.getExchange().toUpperCase()} - EUR/USD`,
				'#EF5350',
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
			'#EF5350',
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
		embed = DiscordService.makeEmbed(`Exchange set to: ${exchange.toUpperCase()}`, '#2A9D8F');
	} else {
		embed = DiscordService.makeEmbed(`Unsuported Exchange: ${ex}`, '#2A9D8F');
	}
	callback.channel.send(embed);
};

const _getExchange = (callback) => {
	const exchange = ticker.getExchange();
	const embed = DiscordService.makeEmbed(`Exchange is: ${exchange.toUpperCase()}`, '#2A9D8F');
	callback.channel.send(embed);
};

const _unsupportedCommand = (command, callback) => {
	const embed = DiscordService.makeEmbed(`Unsuported Command: ${command}`, '#EF5350');
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
