export default class Thing {
	constructor(api) {
		this._api = api
	}
	set link(url) {
		this._link = this._api.resolveUrl(url)
	}
	get link() {
		return this._link
	}
	set image(url) {
		this._image = this._api.resolveUrl(url)
	}
	get image() {
		return this._image
	}
	async inflate() {
		const $ = await this._api.fetch$(this.link)
		const $details = $('#character-details, .wiki-page .plain-header')

		// If the page doesn't have a title: Get one
		if (!this.name) {
			this.name = $details.find('.wiki-page-name.title').text().trim()
		}
    
		if (!this.image) {
			const image = $details.find('img').attr('src')
			if (image) {
				this.image = image
			}
		}
    
		// Then go looking for links
		const linkedNodes = []
    
		const $characterLinks = $details.find('a[href*="/characters/"]')    
		$characterLinks.each((index, element) => {
			const $element = $(element)
			const url = $element.attr('href')
			const slug = url.replace(/^.*\//, '')
			const text = $element.text()
			if (slug === 'edit') {
				return
			}
			linkedNodes.push({ url, slug, text })
		})
    
		const $wikiLinks = $details.find('.wiki-page-link')
		$wikiLinks.each((index, element) => {
			const $element = $(element)
			const url = $element.attr('href')
			linkedNodes.push({ url })
		})
    
		this.linkedNodes = linkedNodes
		return this
	}
}
