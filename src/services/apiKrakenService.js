import axios from 'axios';
import logger from '@/tools/logger';
import { API_ERROR_GET_TICKER } from '@/messages/exchangeMessages';
import { isNil } from 'lodash';

/**
 * Get options
 * @param {string} url the url
 * @param {string} method the method
 * @param {Object} headers the headers
 * @param {Object} params the query string
 * @param {Object} data the body
 * @return {string} signature
 */
const _getOptions = (url, method, headers, params, data) => ({
	baseURL: 'https://api.kraken.com/0/public',
	url,
	method,
	headers,
	params,
	data,
	responseType: 'json'
});

/**
 * Get response api
 * @param {Object} options the options
 * @param {string} errorMessage the error message
 * @return {Object} api results
 */
const _getResponse = async (options, errorMessage) => {
	try {
		const res = await axios.request(options);
		if (!isNil(res)) {
			return res.data;
		}
		return null;
	} catch (error) {
		const err = new Error(errorMessage);
		logger.error({
			file: 'service/apiKrakenService.js',
			method: '_getResponse',
			message: err,
			data: { error }
		});
		throw error;
	}
};

/**
 * Get Ticker
 * @param {string} pair Symbol
 * @return {Array} Trades list
 */
const getTicker = async (pair) => {
	const method = 'GET';
	const url = '/Ticker';
	const params = {
		pair
	};
	const options = _getOptions(url, method, undefined, params, undefined);
	return _getResponse(options, API_ERROR_GET_TICKER);
};
module.exports = { getTicker };
