const tree = {
	title: "root",
	children: [
		{
			title: "hardware", children: [
				{
					title: "computers", children: [
						{ title: "desktop" },
						{ title: "laptop" }
					]
				},
				{
					title: "monitors", children: [
						{ title: "LCD" },
						{ title: "VR" },
						{ title: "Trinitron" }
					]
				},
				{
					title: "tablets", children: [
						{ title: "iPad" },
						{ title: "Android" }
					]
				},
			]
		},
		{
			title: "software", children: [
				{
					title: "games", children: [
						{
							title: "strategy", children: [
								{ title: "single player" },
								{ title: "multi player" }
							]
						},
						{ title: "action" }
					]
				},
				{
					title: "office", children: [
						{ title: "spreadsheet" },
						{ title: "slideshow" }
					]
				}
			]
		},
		{
			title: "other", children: [
				{ title: "mice" },
				{ title: "keyboard" },
				{ title: "books" },
			]
		},
	]
}


let id = -1
const categories = {
	byId: {},
	roots: []
}

function addIds(node, parent) {
	id++
	const current = {
		id: id.toString(),
		title: node.title.toLowerCase(),
		parent: null,
		path: parent.id > 0 ? [parent.id, ...parent.path] : [],
		children: []
	}
	if (parent) {
		if (parent.id > 0) current.parent = parent.id
		categories.byId[id] = current
		parent.children.push(id.toString())
		if (parent.id == 0) categories.roots.push(id.toString())
	}
	if (node.children)
		node.children.forEach((child) => {
			addIds(child, current)
		})
}

addIds(tree, false)

console.log(categories.byId)
console.log(categories.roots)

module.exports = {
	categories
}
