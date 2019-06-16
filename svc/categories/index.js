const { makeServer } = require("../../_shared")
const schema = require('./schema')
const server = makeServer(schema)

const port = process.env.PORT ? process.env.PORT : process.argv[2] ? process.argv[2] : 4005

server.listen(port).then(({ url }) => {
	console.log(`🚀 Categories Server ready at ${url}`)
})
