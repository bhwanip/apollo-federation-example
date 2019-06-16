const { pause } = require("../../_shared")
const { gql } = require("apollo-server")
const { products, getStarsForProduct } = require('../../_shared/data')

const typeDefs = gql`
    extend type Query {
        topProducts(limit: Int = 10): [Product]
    }

    type Product @key(fields: "upc") {
        upc: String!
        category: Category!
        name: String
        price: Int
        weight: Int
    }

    extend type Category @key(fields: "id") {
        id: ID! @external
        products: [Product!]
    }
`

const resolvers = {
	Query: {
		topProducts(_, args) {
			return products
				.map(prod => {
					let stars = getStarsForProduct(prod)
					if (!stars) stars = 2 // no review is probably better than bad review
					return {
						...prod,
						avg: stars
					}
				})
				.sort((a, b) => b.avg - a.avg)
				.slice(0, args.limit)
		}
	},

	Product: {
		__resolveReference(product) {
			return products.find(item => item.upc === product.upc)
		},
		async category(product) {
			await pause("product.category " + product.upc, 2000)
			return { id: product.category }
		}
	},

	Category: {
		async products(category) {
			await pause("category.products " + category.id, 1000)
			return products.filter(prod => prod.category === category.id)
		}
	}
}

module.exports = {
	typeDefs, resolvers
}
