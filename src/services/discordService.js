import logger from '@/tools/logger';
import Discord from 'discord.js';

export default class DiscordService {
	constructor(token) {
		this.token = token;
		this.client = new Discord.Client();
	}

	async login() {
		try {
			this.client.login(this.token);
		} catch (error) {
			logger.error({
				file: 'discordService.js',
				method: 'login',
				message: error
			});
		}
	}

	static makeEmbed(title, color, fields = []) {
		const embed = new Discord.MessageEmbed().setTitle(title).setColor(color);
		if (fields.length > 0) {
			fields.forEach((field) => {
				embed.addFields(field);
			});
		}
		return embed;
	}
}
