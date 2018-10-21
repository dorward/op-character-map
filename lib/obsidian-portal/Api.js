import getAllCharacters from './Api/getAllCharacters'

export default class Api {
	constructor(axios, axiosConfig) {
		this._axios = axios
		this._axiosConfig = axiosConfig
	}
	setSite(site) {
		this._site = site
	}
}

Api.prototype.getAllCharacters = getAllCharacters