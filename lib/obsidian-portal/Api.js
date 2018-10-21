import cheerio from 'cheerio'
import resolveUrl from './Api/resolveUrl'
import getAllCharacters from './Api/getAllCharacters'
import getAllWikiPages from './Api/getAllWikiPages'

export default class Api {
	constructor(axios, axiosConfig) {
		this._axios = axios
		this._axiosConfig = axiosConfig
	}
	setSite(site) {
		this._site = site
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

Api.prototype.resolveUrl = resolveUrl
Api.prototype.getAllCharacters = getAllCharacters
Api.prototype.getAllWikiPages = getAllWikiPages