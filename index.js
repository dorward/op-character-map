const {username, password, site } = require('./config.json')
import obsidianportal from './lib/obsidian-portal'
import graph from './lib/graph'
import write from 'fs-writefile-promise'
import getImages from './lib/getImages'

async function init () {
	const api = await obsidianportal(username, password)
	api.setSite(site)
	const [characters, pages] = await Promise.all([api.getAllCharacters(), api.getAllWikiPages()])
	const entities = characters.concat(pages)
	await getImages(entities)
	const dot = graph(entities)
	await write('data.dot', dot)
}

init()
