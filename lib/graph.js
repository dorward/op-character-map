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
			} else {
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

// async function graph(characters, pages) {
//     if (!characters) {
//         characters = require('./data.json');
//     }
//     // console.log(characters);
//     const g = graphviz.digraph('G');
//     // Add base nodes
//     characters.forEach(c => {
//         c.node = g.addNode(c.name);
//         c.node.set('label', `<<TABLE border='0'><TR><TD><IMG SRC='${c.local_image}' /></TD></TR><TR><TD>${c.name}</TD></TR></TABLE>>`);
//         if (c.pc) {
//             c.node.set( 'style', 'filled' );
//         }
//         c.node.set('penwidth', 2);

//     });

//     pages.forEach(p => {
//         p.node = g.addNode(p.title);
//         p.node.set('shape', 'note');
//         p.node.set('label', `<<TABLE border='0' style='rounded'><TR><TD><IMG SRC='${p.local_image}' /></TD></TR><TR><TD>${p.title}</TD></TR></TABLE>>`);
//         p.node.set('penwidth', 2);
//     });

//     // Add connections
//     characters.forEach(c => {
//         c.edges = [];
//         const linkedSlugs = {};
//         c.linkedSlugs.forEach(item => {
//             const {slug, text} = item;
//             linkedSlugs[slug] = linkedSlugs[slug] || [];
//             let matches = text.match(/(.*?) \((owes|owed) (\d+)/i);
//             if (matches) {
//                 // console.log('matches', matches);
//                 linkedSlugs[slug].push({
//                     text: matches[1],
//                     format: matches[2].toLowerCase(),
//                     number: matches[3],
//                 });
//             }
//         });

//         Object.keys(linkedSlugs).forEach(slug => {
//             const target = characters.find(c => c.slug === slug);
//             const debts = linkedSlugs[slug];
//             if (debts.length) {
//                 debts.forEach(debt => {
//                     // console.log('debt', debt);
//                     const edge = g.addEdge(c.node, target.node);
//                     if (debt.format === 'owed') {
//                         edge.set('color', 'blue');
//                     } else {
//                         edge.set('color', 'red');
//                     }
//                     edge.set('label', debt.text + ':' + debt.number);
//                     edge.set('penwidth', 2);
//                 });
//             } else {
//                 const edge = g.addEdge(c.node, target.node);
//                 edge.set('style', 'dotted');
//                 edge.set('penwidth', 2);
//             }
//         });

//         c.linkedPages.forEach(url => {
//             const node = pages.find(page => page.url === url).node;
//             const edge = g.addEdge(c.node, node);
//             edge.set('style', 'dotted');
//             edge.set('penwidth', 2);
//         });
//     });

//     pages.forEach(p => {
//         p.links.forEach(link => {
//             const target = (link.slug) ?
//                 characters.find(c => c.slug === link.slug) :
//                 pages.find(potential_target => link.url === potential_target.url);
//             const from = p.node;
//             const to = target.node;
//             const edge = g.addEdge(from, to);
//             edge.set('style', 'dotted');
//             edge.set('penwidth', 2);

//         });
//     });

//     // The graphviz library doesn't support HTML labels so this hacks around teh limitation
//     const dot = g.to_dot().replace(/"<</g, '< <').replace(/>>"/g, '> >');
//     await write('data.viz', dot);
//     run('dot -T png -O data.viz');
// }
