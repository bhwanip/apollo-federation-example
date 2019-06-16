const { ApolloServer } = require("apollo-server")
const { buildFederatedSchema } = require("@apollo/federation")
require('colors')


const { print } = require('graphql')

const sleep = (time) => {
	return new Promise((res) => setTimeout(res, time))
}

const pause = (msg, time) => {
	console.log(">>".bgGreen.black, msg)
	return new Promise((res) => setTimeout(() => {
		console.log("<<".bgRed.black, msg)
		res()
	}, time))
}

// type EndHandler = (...errors: Array<Error>) => void;

class BasicLogging {
	// public didEncounterErrors?(errors: ReadonlyArray<GraphQLError>): void;


	/*
	public requestDidStart?(o: {
		request: Pick<Request, 'url' | 'method' | 'headers'>;
		queryString?: string;
		parsedQuery?: DocumentNode;
		operationName?: string;
		variables?: { [key: string]: any };
		persistedQueryHit?: boolean;
		persistedQueryRegister?: boolean;
		context: TContext;
		requestContext: GraphQLRequestContext<TContext>;
	  }): EndHandler | void;
	 */
	requestDidStart({ request, queryString, parsedQuery, operationName, variables, context, persistedQueryHit, persistedQueryRegister, requestContext }) {
		const query = queryString || print(parsedQuery)
		context["IntrospectionQuery"] = !!query.match(/IntrospectionQuery/)
		if (!context["IntrospectionQuery"]) {

			console.log("\n\nrequest".blue, (new Date()).toISOString())
			// console.log("context", JSON.stringify(context))
			// console.log("queryString", JSON.stringify(queryString))
			// console.log("requestContext", JSON.stringify(requestContext))
			console.log("  query", query.replace(/\s+/g, " "))
			console.log("  variables", variables)
		}
	}

	//public willSendResponse?(o: { graphqlResponse: GraphQLResponse; context: TContext; }): void | { graphqlResponse: GraphQLResponse; context: TContext };
	willSendResponse({ graphqlResponse, context }) {
		const { http, errors, data, http: { headers } } = graphqlResponse
		// willSendResponse({ graphqlResponse }) {
		if (!context["IntrospectionQuery"]) {
			console.log("\nresponse".cyan)
			// console.log("response", Object.keys(x))
			// console.log("response", graphqlResponse)
			// console.log("http", http)
			if (errors) {

				console.log("  errors", errors)
			}
			console.log("  data", JSON.stringify(data).substring(0, 250))
		}
	}

	/*
	 public willResolveField?( source: any, args: { [argName: string]: any }, context: TContext, info: GraphQLResolveInfo ):
	  		((error: Error | null, result?: any) => void) | void;
	 */
	willResolveField(source, args, context, info) {
	}
}

function makeServer(schema) {
	return new ApolloServer({
		schema: buildFederatedSchema([schema]),
		extensions: [() => new BasicLogging()],
		context: ({ req, res }) => ({ headers: req.headers })
	})
}


module.exports = {
	makeServer, sleep, pause
}
