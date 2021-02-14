import logger from '@/tools/logger';
import { exchangesList, exchangeSymbol } from '@/constants/exchanges';
import apiFtx from '@/services/apiFtxService';
import apiBinance from '@/services/apiBinanceService';
import apiBitstamp from '@/services/apiBitstampService';
import apiKraken from '@/services/apiKrakenService';
import { ftxMapper, binanceMapper, bitstampMapper, krakenMapper } from '@/mappers/tickerMapper';
import { isNil } from 'lodash';

export default class TickerService {
	constructor(exchange) {
		this.exchange = exchange;
		this.exchangeSym = exchangeSymbol[exchange];
		this.lastPrice = new Map();
	}

	async getTicker() {
		try {
			let price = null;
			if (this.exchange === 'ftx') {
				const res = await apiFtx.getTicker(this.exchangeSym);
				price = ftxMapper(res);
			}

			if (this.exchange === 'binance') {
				const res = await apiBinance.getTicker(this.exchangeSym);
				price = binanceMapper(res);
			}

			if (this.exchange === 'bitstamp') {
				const res = await apiBitstamp.getTicker(this.exchangeSym);
				price = bitstampMapper(res);
			}

			if (this.exchange === 'kraken') {
				const res = await apiKraken.getTicker(this.exchangeSym);
				price = krakenMapper(res);
			}

			if (!isNil(price) && price > 0) this.lastPrice.set(this.exchange, price);

			return price;
		} catch (error) {
			logger.error({
				file: 'services/tickerService.js',
				method: '_getTicker',
				message: error
			});
			throw error;
		}
	}

	setExchange(exchange) {
		if (exchangesList.includes(exchange)) {
			this.exchange = exchange;
			return this.exchange;
		}
		return null;
	}

	getExchange() {
		return this.exchange;
	}

	getLastPrice() {
		if (this.lastPrice.has(this.exchange)) {
			return this.lastPrice[this.exchange];
		}
		return null;
	}
}
