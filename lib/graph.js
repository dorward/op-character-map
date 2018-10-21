import graphviz from 'graphviz'

export default function graph(entities) {
	const g = graphviz.digraph('G')
	entities.forEach(e => e.createGraphNode(g))
	makeConnections(g, entities)
	// Hack to work around bugs in underlying library
	const dot = g
		.to_dot()
		.replace(/"<</g, '< <')
		.replace(/>>"/g, '> >')
	return dot
}

const debtexpression = /(.*?) \((owes|owed) (\d+)/i

function makeConnections(g, entities) {
	// First we do debts because we can have more than one of them
	entities.forEach(e => {
		e.connections.forEach(c => {
			let from = e
			let to = entities.find(search => search.link == c.link)

			const debt = c.text.match(debtexpression)
			if (debt) {
				const edge = g.addEdge(from.graphNode, to.graphNode)
				edge.set('label', debt[1] + ':' + debt[3])
				edge.set('penwidth', 2)
				if (debt[2].toLowerCase() === 'owed') {
					edge.set('color', 'blue')
				} else {
					edge.set('color', 'red')
				}
				if (entities.indexOf(from) > entities.indexOf(to)) {
					[from, to] = [to, from]
				}
				from.recordedConnections[to.link] = true
			}
		})
	})

	// Then we do non-debts
	entities.forEach(e => {
		e.connections.forEach(c => {
			let from = e
			let to = entities.find(search => search.link == c.link)

			const debt = c.text.match(debtexpression)
			if (!debt) {
				if (entities.indexOf(from) > entities.indexOf(to)) {
					[from, to] = [to, from]
				}
				if (from.recordedConnections[to.link]) {
					return null
				}
				const edge = g.addEdge(from.graphNode, to.graphNode)
				from.recordedConnections[to.link] = true
				edge.set('penwidth', 2)
				edge.set('dir', 'none')
			}
		})
	})
}
