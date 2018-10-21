const {username, password, site } = require('./config.json')
import obsidianportal from './lib/obsidian-portal'

async function init () {
	const api = await obsidianportal(username, password)
	api.setSite(site)
	const characters = await api.getAllCharacters()
	characters.forEach(character => {
		console.log(character.name, character.linkedNodes)
	})
	// console.log(characters)
}

init()