import Entity from './Entity'

export default class Character extends Entity {
	constructor(api, details) {
		super(api, details)
	}
	styleNode() {
		Entity.prototype.styleNode.call(this)
		const n = this.graphNode
		if (this.type === 'pc') {
			n.set('style', 'filled')
		}
	}

}