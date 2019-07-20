import Thing from './index'
import Connection from './Connection'

export default class Entity extends Thing{
	constructor(api, details) {
		super(api, details)
		this.recordedConnections = {}
	}
	set image(url) {
		if (!url) {
			console.log('Error finding image for ', this._link)
			return
		}
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
			this.image = image
		}
	
		if (this.image) {
			this.localImage = await this._api.getFilenameForUrl(this.image)
		}

		// Then go looking for links
		const connections = []
    
		const $connections = $details.find('.wiki-page-link, .wiki-content-link, a[href*="/characters/"]')    
		$connections.each((index, element) => {
			const $element = $(element)
			const raw_link = $element.attr('href')
			const link = raw_link.replace(/^\/?campaigns?\/[^\/]*\//, '/')
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
	styleNode() {
		const n = this.graphNode 
		n.set('penwidth', 2)
	}
	createGraphNode(g) {
		const n = g.addNode(this.name)
		this.graphNode = n
		const image = this.localImage ? `<TR><TD><IMG SRC='${this.localImage}' /></TD></TR>` : ''
		n.set('label', `<<TABLE border='0'>${image}<TR><TD>${this.name}</TD></TR></TABLE>>`)
		this.styleNode()
		return n
	}
}
