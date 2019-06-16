const { gql } = require("apollo-server")
const { users } = require('../../_shared/data')

const typeDefs = gql`
    extend type Query {
        me: User
    }

    type User @key(fields: "id") {
        id: ID!
        name: String
        username: String
    }
`

const resolvers = {
	Query: {
		me() {
			return { id: users[0].id }
		}
	},
	User: {
		__resolveReference(object) {
			return users.find(user => user.id === object.id)
		},
		username(object) {
			return users.find(user => user.id === object.id).username
		},
		name(object) {
			return users.find(user => user.id === object.id).name
		}
	}
}

module.exports = {
	typeDefs, resolvers
}
