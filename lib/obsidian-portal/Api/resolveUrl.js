import url from 'url'

export default function resolveUrl(relativeUrl) {
	return url.resolve(this._site, relativeUrl).toString()
}
