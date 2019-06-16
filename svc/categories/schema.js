const { gql } = require("apollo-server")
const { categories } = require('./data')

const typeDefs = gql`
    extend type Query {
        categories: [Category]
    }

    type Category @key(fields: "id") {
        id: ID!
        title: String!
        slug: String!
        parent: Category
        children: [ Category! ]!
#        products: [ Product! ]
    }

#    extend type Product @key(fields: "upc") {
#        upc: String! @external
#        #		products: [Product!]
#    }
`

const resolvers = {
	Query: {
		categories() {
			return categories.roots.map((id) => ({ id }))
		}
	},
	Category: {
		__resolveReference(object) {
			return categories.byId[object.id]
		},
		title(object) {
			return categories.byId[object.id].title
		},
		slug(object) {
			let category = categories.byId[object.id]
			return [...category.path, object.id].map(catId => categories.byId[catId].title.replace(/[^a-z0-9]/, "-")).join("/")
		},
		parent(object) {
			let category = categories.byId[object.id]
			return category.parent ? { id: category.parent } : null
		},
		children(object) {
			let category = categories.byId[object.id]
			return category.children.map(id => categories.byId[id])
		}
		,
		products(object) {
			return [{upc:"2"}]
		}
	}
}

module.exports = {
	typeDefs, resolvers
}
