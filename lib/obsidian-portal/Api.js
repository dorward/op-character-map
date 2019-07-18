import cheerio from 'cheerio'
import resolveUrl from './Api/resolveUrl'
import getAllCharacters from './Api/getAllCharacters'
import getAllWikiPages from './Api/getAllWikiPages'
import unf from 'unique-file-name'

const namer = unf({
	format: '%16b_%6r%8e',
	dir: 'images'
})
const downloads = {}

export default class Api {
	constructor(axios, axiosConfig) {
		this._axios = axios
		this._axiosConfig = axiosConfig
		this._downloads = downloads
	}
	setSite(site) {
		this._site = site
	}
	async fetchUrl(url, options = {}) {
		return await this._axios(this.resolveUrl(url), Object.assign(options, this._axiosConfig))
	}
	async fetch$(url) {
		const response = await this.fetchUrl(url)
		const html = response.data
		const $ = cheerio.load(html)
		return $
	}
	async getFilenameForUrl(url) {
		if (downloads[url]) {
			console.log('Cached! ', url, downloads[url])
			return downloads[url]
		}
		const url_object = new URL(url)
		const pathname = url_object.pathname
		const filename = await namer(pathname)
		const relative_filename = filename.replace(/^.*?\/images\//, 'images/')
		downloads[url] = relative_filename
		console.log('Filenames', filename, relative_filename)
		return relative_filename
	}
}

Api.prototype.resolveUrl = resolveUrl
Api.prototype.getAllCharacters = getAllCharacters
Api.prototype.getAllWikiPages = getAllWikiPages