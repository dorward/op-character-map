import Page from './Thing/Page'

export default async function getAllWikiPages(pages) {
	if (!pages) {
		pages = [ new Page(this, { link: 'wikis/main-page' }) ]
	}

	// If all the known URLs have data, stop recursing and return
	const pages_missing_data = pages.filter(page => !page.name)
	if (pages_missing_data.length === 0) {
		return pages
	}

	// Populate all the remaining pages
	await Promise.all(pages_missing_data.map(page => page.inflate()))

	// Look for new pages
	const connections = getConnections(pages)
	const wikiconnections = connections.filter(link => link.match(/\/wikis\//))
	const newconnections = wikiconnections.filter(link => !pages.find(page => page.link === link))
	
	return getAllWikiPages(
		pages.concat(
			newconnections.map(
				link => new Page(this, {link})
			)
		)
	)
}

function getConnections(pages) {
	return pages.reduce(
		(accumulator, page) => {
			const connections = page.connections
			connections.forEach(connection => {
				const link = connection.link
				if (accumulator.indexOf(link) < 0) {
					accumulator.push(link)
				}
			})
			return accumulator
		},
		[]
	)
}
