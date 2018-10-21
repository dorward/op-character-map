const {username, password, site } = require('./config.json')
import obsidianportal from './lib/obsidian-portal'

async function init () {
	const api = await obsidianportal(username, password)
	api.setSite(site)
	const characters = await api.getAllCharacters()
	console.log(characters)
}

init()