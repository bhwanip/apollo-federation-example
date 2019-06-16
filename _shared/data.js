const usernames = [
	{ id: "1", username: "@ada" },
	{ id: "2", username: "@complete" }
]

const users = [
	{ id: "1", name: "Ada Lovelace", birthDate: "1815-12-10", username: "@ada" },
	{ id: "2", name: "Alan Turing", birthDate: "1912-06-23", username: "@complete" },
	{ id: "3", name: "Linus Torvalds", birthDate: "1969-12-28", username: "@linus__torvalds" },
	{ id: "4", name: "Joe Armstrong", birthDate: "1962-01-18", username: "@joeerl" }
]

const inventory = [
	{ upc: "1", inStock: true },
	{ upc: "2", inStock: false },
	{ upc: "3", inStock: true },
	{ upc: "4", inStock: true },
	{ upc: "5", inStock: false },
	{ upc: "6", inStock: true }
]

const products = [
	{ upc: "1", category: "24", name: "Pragmatic Programmer", price: 899, weight: 100 },
	{ upc: "2", category: "16", name: "Ludo 3D", price: 1299, weight: 1000 },
	{ upc: "3", category: "7", name: "Samsung VR300 DT", price: 54, weight: 50 },
	{ upc: "4", category: "24", name: "Go for dummies", price: 154, weight: 50 },
	{ upc: "5", category: "22", name: "Logitech Gamer Z", price: 154, weight: 50 },
	{ upc: "6", category: "19", name: "VisiCalc", price: 12154, weight: 50 }
]

const reviews = [
	{ id: "1", authorID: "1", product: { upc: "1" }, stars: 5, body: "Love it!" },
	{ id: "2", authorID: "2", product: { upc: "3" }, stars: 1, body: "Too expensive." },
	{ id: "3", authorID: "4", product: { upc: "6" }, stars: 3, body: "It was ok." },
	{ id: "4", authorID: "2", product: { upc: "2" }, stars: 3, body: "Prefer something else." },
	{ id: "5", authorID: "2", product: { upc: "3" }, stars: 2, body: "Could be better." },
	{ id: "6", authorID: "4", product: { upc: "1" }, stars: 4, body: "Helpful." },
]

function getStarsForProduct(product) {
	let matches = reviews.filter(review => review.product.upc === product.upc)
	if (matches.length == 0) return null
	return matches.reduce((p, c, i) => {
		return (p * i + c.stars) / (i + 1)
	}, 0)
}

module.exports = {
	inventory, users, products, usernames, reviews,
	getStarsForProduct
}
