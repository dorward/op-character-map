const {username, password, site } = require('./config.json')
import obsidianportal from './lib/obsidian-portal'
import graph from './lib/graph'
import write from 'fs-writefile-promise'
import getImages from './lib/getImages'
import child_process from 'child_process'
import commander from 'commander'

async function init () {
	const api = await obsidianportal(username, password)
	api.setSite(site)
	const [characters, pages] = await Promise.all([api.getAllCharacters(), api.getAllWikiPages()])
	const entities = characters.concat(pages.filter(page => !page.link.match(/main-page$/)))
	await getImages(entities)
	await run('./resize.sh')
	let options = 'all'
	if (commander.connectionsOnly) {
		options = 'connections'
	} else if (commander.debtsOnly) {
		options = 'debts'
	}
	const dot = graph(entities, options)
	await write('data.dot', dot)
	await run('dot -T png -O data.dot')
}

async function run(command) {
	return new Promise((res) => {
		child_process.exec(command, function(error, stdout){ res(stdout) })
	})
}

commander
	.version('0.0.1')
	.option('-d, --debts-only', 'Only show debts')
	.option('-c, --connections-only', 'Only show nodes that have a connection')
	.parse(process.argv)

init()
