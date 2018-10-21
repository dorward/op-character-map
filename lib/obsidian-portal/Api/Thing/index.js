import resolveUrl from '../resolveUrl'

export default class Thing {
	constructor(site) {
		this._site = site
	}
	set link(url) {
		this._link = this.resolveUrl(url)
	}
	get link() {
		return this._link
	}
	set image(url) {
		this._image = this.resolveUrl(url)
	}
	get image() {
		return this._image
	}
}

Thing.prototype.resolveUrl = resolveUrl