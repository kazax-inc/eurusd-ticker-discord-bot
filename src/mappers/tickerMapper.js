const ftxMapper = (data) => data.result.last;

const binanceMapper = (data) => data.price;

const bitstampMapper = (data) => data.last;

const krakenMapper = (data) => {
	const symbol = Object.keys(data.result)[0];
	return data.result[symbol].c[0];
};

export { ftxMapper, binanceMapper, bitstampMapper, krakenMapper };
