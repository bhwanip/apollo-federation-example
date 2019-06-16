const { gql } = require("apollo-server")
const { inventory } = require('../../_shared/data')

const typeDefs = gql`
    extend type Product @key(fields: "upc") {
        upc: String! @external
        weight: Int @external
        price: Int @external
        inStock: Boolean
        shippingEstimate: Int @requires(fields: "price weight")
    }
`

const resolvers = {
	Product: {
		__resolveReference(product) {
			return {
				...product,
				...inventory.find(item => item.upc === product.upc)
			}
		},
		shippingEstimate(product) {
			// free for expensive items
			if (product.price > 1000) return 0
			// estimate is based on weight
			return product.weight * 0.5
		}
	}
}


module.exports = {
	typeDefs, resolvers
}
