import url from 'url'
import cheerio from 'cheerio'

import getAllCharacters from './Api/getAllCharacters'

export default class Api {
	constructor(axios, axiosConfig) {
		this._axios = axios
		this._axiosConfig = axiosConfig
	}
	setSite(site) {
		this._site = site
	}
	resolveUrl(relativeUrl) {
		return url.resolve(this._site, relativeUrl).toString()
	}
	async fetchUrl(url) {
		return await this._axios(this.resolveUrl(url), this._axiosConfig)
	}
	async fetch$(url) {
		const response = await this.fetchUrl(url)
		const html = response.data
		const $ = cheerio.load(html)
		return $
	}
}

Api.prototype.getAllCharacters = getAllCharacters