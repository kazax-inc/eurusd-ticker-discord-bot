const getConfig = () => ({
	port: process.env.PORT,
	botToken: process.env.BOT_TOKEN,
	prefix: process.env.PREFIX,
	command: process.env.CMD,
	exchange: process.env.EXCHANGE
});

const getEnvConfig = () => ({ ...getConfig() });

export default getEnvConfig();
