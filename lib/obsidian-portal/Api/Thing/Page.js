import Entity from './Entity'

export default class Page extends Entity {
	constructor(api, details) {
		super(api, details)
		this.type = 'page'
	}
	styleNode() {
		Entity.prototype.styleNode.call(this)
		const n = this.graphNode
		n.set('shape', 'note')
	}
}