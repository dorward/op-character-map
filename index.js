const {username, password, site } = require('./config.json')
import obsidianportal from './lib/obsidian-portal'
import graph from './lib/graph'
import write from 'fs-writefile-promise'
import getImages from './lib/getImages'
import child_process from 'child_process'

async function init () {
	const api = await obsidianportal(username, password)
	api.setSite(site)
	const [characters, pages] = await Promise.all([api.getAllCharacters(), api.getAllWikiPages()])
	const entities = characters.concat(pages)
	await getImages(entities)
	await run('./resize.sh')
	const dot = graph(entities)
	await write('data.dot', dot)
	await run('dot -T png -O data.dot')

}

async function run(command) {
	return new Promise((res) => {
		child_process.exec(command, function(error, stdout){ res(stdout) })
	})
}


init()
