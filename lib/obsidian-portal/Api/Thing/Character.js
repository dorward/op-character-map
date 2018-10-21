import Thing from './'

export default class Character extends Thing {
	constructor(site, details) {
		super(site)
		Object.keys(details).forEach(key => {
			this[key] = details[key]
		})
	}
}