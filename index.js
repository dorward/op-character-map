const {username, password, site } = require('./config.json')
import obsidianportal from './lib/obsidian-portal'

async function init () {
	const api = await obsidianportal(username, password)
	api.setSite(site)
	// const [characters, pages] = await Promise.all(api.getAllCharacters(), api.getAllWikiPages())
	// characters.forEach(character => {
	// 	console.log(character.name, character.connections.map(node => node.link))
	// })
    
	const pages = await api.getAllWikiPages()
	log(pages)
	// console.log(characters)
}

init()


function log(x) {
	console.log(JSON.stringify(x, (key, value) => {
		if (key === '_api') {
			return undefined
		} else {
			return value
		}
	}, 2))

}