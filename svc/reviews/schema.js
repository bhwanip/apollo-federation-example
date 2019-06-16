const { gql } = require("apollo-server")
const { reviews, usernames, getStarsForProduct } = require('../../_shared/data')

const typeDefs = gql`
    enum ReviewOrder {
        BY_AVG
        BY_COUNT
    }

    extend type Query {
        reviews: [Review]
        topReviewers(limit: Int = 10,order: ReviewOrder = BY_COUNT): [User]
    }

    type Review @key(fields: "id") {
        id: ID!
        stars: Int!
        body: String
        author: User @provides(fields: "username")
        product: Product
    }

    extend type User @key(fields: "id") {
        id: ID! @external
        username: String @external
        reviews: [Review]
    }

    extend type Product @key(fields: "upc") {
        upc: String! @external
        reviews: [Review]
        stars: Float
    }
`


const resolvers = {
	Query: {
		reviews() {
			return reviews
		},
		topReviewers(_, args) {
			const users = Object.values(reviews.reduce((users, review) => {
				let userID = review.authorID
				if (!users[userID]) users[userID] = { id: userID, count: 0 }
				users[userID].count++
				users[userID].sum += review.stars
				users[userID].avg = users[userID].sum / users[userID].count
				return users
			}, {}))

			if (args.order === "BY_AVG")
				return users.sort((a, b) => b.avg - a.avg).slice(0, args.limit)
			else
				return users.sort((a, b) => b.count - a.count).slice(0, args.limit)
		}
	},

	Review: {
		author(review) {
			return { __typename: "User", id: review.authorID }
		}
	},

	User: {
		reviews(user) {
			return reviews.filter(review => review.authorID === user.id)
		},
		numberOfReviews(user) {
			return reviews.filter(review => review.authorID === user.id).length
		},
		username(user) {
			const found = usernames.find(username => username.id === user.id)
			return found ? found.username : null
		}
	},

	Product: {
		reviews(product) {
			return reviews.filter(review => review.product.upc === product.upc)
		},
		stars(product) {
			return getStarsForProduct(product)
		},
		numberOfReviews(product) {
			return reviews.filter(review => review.product.upc === product.upc).length
		},
	}
}

module.exports = {
	typeDefs, resolvers
}
