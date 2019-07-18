import graphviz from 'graphviz'

export default function graph(entities, options) {
	const g = graphviz.digraph('G')
	entities = filter(entities, options)
	entities.forEach(e => e.createGraphNode(g))
	makeConnections(g, entities, options)
	// Hack to work around bugs in underlying library
	const dot = g
		.to_dot()
		.replace(/"<</g, '< <')
		.replace(/>>"/g, '> >')
	return dot
}

const debtexpression = /(.*?) \((owes|owed) (\d+)/i

function makeConnections(g, entities, options) {
	// First we do debts because we can have more than one of them
	entities.forEach(e => {
		e.connections.forEach(c => {
			let from = e
			let to = entities.find(search => search.link == c.link)
			if (typeof to === 'undefined') {
				// Link to non-existent character
				console.log('Could not make connection ', c._link, ' from ', e.name)
				return
			}
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
				to.hasDebt = true
				from.hasDebt = true
			}
		})
	})

	// Then we do non-debts (if they are desired)
	if (options === 'debts') {
		return
	}
	entities.forEach(e => {
		e.connections.forEach(c => {
			let from = e
			let to = entities.find(search => search.link == c.link)

			if (typeof to === 'undefined') {
				// Link to non-existent character
				console.log('Could not make connection ', c._link, ' from ', e.name)
				return
			}

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
				to.hasConnection = true
				from.hasConnection = true
			}
		})
	})
}

function filter(entities, options) {
	if (options === 'all') {
		return entities
	} else {
		return entities.filter(
			e => {
				// e is the entity we care about. We need to know if it has a
				// connection or if anything connects to it
				const outgoing_connections = e.connections.find(
					c => {
						// If we are looking for any kind of connection, then just go true
						if (options === 'connections') {
							return true
						}
						// Otherwise look for a debt in particular
						if (c.text.match(debtexpression)) {
							return true
						}
					}
				)
				if (outgoing_connections) {
					return true
				} else {
					// There are no suitable outgoing connections so search for an incoming one
					const incoming_connections = entities.find(other_e => {
						return other_e.connections.find(
							c => {
								// Skip non-debts if we care only about debts
								if (options === 'debts' && !c.text.match(debtexpression)) {
									return false
								} else {
									return c.link === e.link
								}
							}
						)
					})
					if (incoming_connections) {
						return true
					} else {
						return false
					}
				}
			}
		)
	}

	
}