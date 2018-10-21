import path from 'path'

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
	get localImage() {
		const image = this._image
		if (!image) {
			return null
		}
		const url = new URL(image)
		const pathname = url.pathname
		const filename = path.basename(pathname)
		return filename
	}
}
