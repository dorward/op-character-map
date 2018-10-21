export default class Thing {
	constructor(api, details) {
		this._api = api
		Object.keys(details).forEach(key => {
			this[key] = details[key]
		})
	}
	set link(url) {
		this._link = this._api.resolveUrl(url)
	}
	get link() {
		return this._link
	}
}
