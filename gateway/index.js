const { ApolloServer } = require("apollo-server")
const { ApolloGateway } = require("@apollo/gateway")

const gateway = new ApolloGateway({
	serviceList: [
		{ name: "accounts", url: "http://localhost:4001" },
		{ name: "inventory", url: "http://localhost:4002" },
		{ name: "products", url: "http://localhost:4003" },
		{ name: "reviews", url: "http://localhost:4004" },
		{ name: "categories", url: "http://localhost:4005" },
	]
});

(async () => {
	const { schema, executor } = await gateway.load()

	const server = new ApolloServer({ schema, executor })

	server.listen().then(({ url }) => {
		console.log(`🚀 Server ready at ${url}`)
	})
})()
