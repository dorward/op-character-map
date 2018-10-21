import Thing from './index'
import Connection from './Connection'

export default class Entity extends Thing{
	constructor(api, details) {
		super(api, details)
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
		const connections = []
    
		const $connections = $details.find('.wiki-page-link, a[href*="/characters/"]')    
		$connections.each((index, element) => {
			const $element = $(element)
			const link = $element.attr('href')
			const slug = link.replace(/^.*\//, '')
			const text = $element.text()
			if (slug === 'edit') {
				return
			}
			connections.push(
				new Connection(this._api, { link, text })
			)
		})
        
		this.connections = connections
		return this
	}
	createGraphNode(g) {
		const n = g.addNode(this.name)
		this.graphNode = n
		n.set('label', `<<TABLE border='0'><TR><TD><IMG SRC='${this.local_image}' /></TD></TR><TR><TD>${this.name}</TD></TR></TABLE>>`)
		return n
	}
}
