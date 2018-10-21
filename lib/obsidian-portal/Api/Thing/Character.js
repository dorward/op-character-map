import Thing from './'

export default class Character extends Thing {
	constructor(api, details) {
		super(api)
		Object.keys(details).forEach(key => {
			this[key] = details[key]
		})
	}
}