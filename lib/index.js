'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var KoaRouter = _interopDefault(require('koa-router'));
var koaLogger = _interopDefault(require('koa-logger'));
var koaBody = _interopDefault(require('koa-bodyparser'));
var koaCors = _interopDefault(require('@koa/cors'));
var apolloServerKoa = require('apollo-server-koa');
var merge = _interopDefault(require('lodash.merge'));
var GraphQLJSON = _interopDefault(require('graphql-type-json'));
var graphqlTools = require('graphql-tools');
var request = _interopDefault(require('request-promise-native'));
var graphql = require('graphql');

/**
 * Creates a request following the given parameters
 * @param {string} url
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */
async function generalRequest(url, method, body, fullResponse) {
	const parameters = {
		method,
		uri: encodeURI(url),
		body,
		json: true,
		resolveWithFullResponse: fullResponse
	};
	if (process.env.SHOW_URLS) {
		// eslint-disable-next-line
		console.log(url);
	}

	try {
		return await request(parameters);
	} catch (err) {
		return err;
	}
}

/**
 * Adds parameters to a given route
 * @param {string} url
 * @param {object} parameters
 * @return {string} - url with the added parameters
 */
function addParams(url, parameters) {
	let queryUrl = `${url}?`;
	for (let param in parameters) {
		// check object properties
		if (
			Object.prototype.hasOwnProperty.call(parameters, param) &&
			parameters[param]
		) {
			if (Array.isArray(parameters[param])) {
				queryUrl += `${param}=${parameters[param].join(`&${param}=`)}&`;
			} else {
				queryUrl += `${param}=${parameters[param]}&`;
			}
		}
	}
	return queryUrl;
}

/**
 * Generates a GET request with a list of query params
 * @param {string} url
 * @param {string} path
 * @param {object} parameters - key values to add to the url path
 * @return {Promise.<*>}
 */
function getRequest(url, path, parameters) {
	const queryUrl = addParams(`${url}/${path}`, parameters);
	return generalRequest(queryUrl, 'GET');
}

/**
 * Merge the schemas in order to avoid conflicts
 * @param {Array<string>} typeDefs
 * @param {Array<string>} queries
 * @param {Array<string>} mutations
 * @return {string}
 */
function mergeSchemas(typeDefs, queries, mutations) {
	return `${typeDefs.join('\n')}
    type Query { ${queries.join('\n')} }
    type Mutation { ${mutations.join('\n')} }`;
}

function formatErr(error) {
	const data = graphql.formatError(error);
	const { originalError } = error;
	if (originalError && originalError.error) {
		const { path } = data;
		const { error: { id: message, code, description } } = originalError;
		return { message, code, description, path };
	}
	return data;
}

const authTypeDef = `
    type Auth {
        email: String!
        password: String!
        answer: String!
    }
    input AuthInput {
        email: String!
        password: String!
    }
`;

const authMutations = `
    auth(auth: AuthInput!): Auth!
`;

const lugaresTypeDef = `
type Lugar {
    _id: String!
    nombre: String!
    nivelPrecio: String!
    ubicacion: Point!
    direccion: String
    horario: String
    calificacion: String
    tipo: String
    ciudad: String
    pais: String

}

type Point
{
    type: String!
    coordinates: [Float]!
    index: String!
}

input LugarInput {
    code: Int!
    name: String!
    credits: Int!
}
`;

const lugaresQueries = `
    alllugares: [Lugar]!  
    lugarById(id: String!): Lugar! 
`;

 

const lugaresMutations = `
    createLugar(id: String): Lugar!
    deleteLugar(id: String!): Lugar!
    updateLugar(id: String!): Lugar!
`;

const citasTypeDef = `
type Cita {
    id:          Int!
    cita:        String!
    lugar:       Int!
    fecha:       String!
    personas:    [Int]!
    estado:      String!
    visibilidad: Boolean!
}
input CitaInput {
    cita:        String!
    lugar:       Int!
    fecha:       String!
    personas:    [Int]!
    estado:      String!
    visibilidad: Boolean!
}
`;

const citasQueries = `
  citaById(id: Int!): Cita!
  citaByPersonaId(id: Int!): [Cita]!
`;

const citasMutations = `
    createCita(cita: CitaInput!): Cita!
    deleteCita(id: Int!): Cita!
    updateCita(id: Int!, cita: CitaInput!): Cita!
`;

const gustosTypeDef = `
type Category {
    id: Int!
    name: String!
    description: String!
    created_at: String!
    updated_at: String!
}
type Subcategory {
    id: Int!
    name: String!
    description: String!
    category_id: Int!
    created_at: String!
    updated_at: String!
    category: Category
}
type Pleasure {
    id: Int!
    name: String!
    description: String!
    user_id: Int!
    subcategory_id: Int!
    created_at: String!
    updated_at: String!
    subcategory: Subcategory
}
input CategoryInput {
    name: String!
    description: String!
}
input SubcategoryInput {
    name: String!
    description: String!
    category_id: Int!
}
input PleasureInput {
    name: String!
    description: String!
    user_id: Int!
    subcategory_id: Int!
}
`;

const gustosQueries = `
    allCategories: [Category]!
    categoryById(id: Int!): Category!
    categoriesByName(name: String!): [Category]
    allSubcategories: [Subcategory]!
    subcategoryById(id: Int!): Subcategory!
    subcategoriesByCategory(category_id: Int!): [Subcategory]
    subcategoriesByName(name: String!): [Subcategory]
    allPleasures: [Pleasure]!
    pleasureById(id: Int!): Pleasure!
    pleasuresBySubcategory(subcategory_id: Int!): [Pleasure]
    pleasureByUser(user_id: Int!): [Pleasure]
    pleasuresByCategory(category_id: Int!): [Pleasure]
    pleasuresByName(name: String!): [Pleasure]
`;

const gustosMutations = `
    createCategory(category: CategoryInput!): Category!
    deleteCategory(id: Int!): Category!
    updateCategory(id: Int!, category: CategoryInput!): Category!
    createSubcategory(subcategory: SubcategoryInput!): Subcategory!
    deleteSubcategory(id: Int!): Subcategory!
    updateSubcategory(id: Int!, subcategory: SubcategoryInput!): Subcategory!
    createPleasure(pleasure: PleasureInput!): Pleasure!
    deletePleasure(id: Int!): Pleasure
    updatePleasure(id: Int!, pleasure: PleasureInput!): Pleasure!
`;

const usuariosTypeDef = `
type User {
    id: Int!
    name: String!
    email: String!
    gender: String!
    picture: String!
    age: String!
    oauth_token: String!

}


input UserInput {
    name: String!
    email: String!
    gender: String!
    picture: String!
    age: String!
    password: String!
}

type token {
    jwt: String   
}

input autInput {
    aut: auth
}

input auth {
    email: String!
    password: String!
}

`;

const usuariosQueries = `
    allUsers: [User]!
    userById(id: Int!): User!
`;

const usuariosMutations = `
    createToken(auth: autInput!): token!
    createUser(user: UserInput!): User!
    deleteUser(id: Int!): User!
    updateUser(id: Int!, user: UserInput!): User! 

`;

const matchTypeDef = `
type Match {
    id: Int!
    id_user_one: Int!
    id_user_two: Int!
    state_user_one: Int!
    state_user_two: Int!

}

input MatchInput {
    id_user_one: Int!
    id_user_two: Int!
    state_user_one: Int!
}



type PleasureMatch {
    name: String!
    description: String!
    user_id: Int!
    subcategory_id: Int!
}

input ListPossibleMatchInput {
    listUsers:[Int]!
}


type ListPossibleFiltered {
    listUsersFiltered:[Int]!
}
`;

const matchQueries = `
    allMatch: [Match]!
    matchById(id: Int!): [Match]!
`;

const matchMutations = `
    createMatch(match: MatchInput!): Match!
    filtrateListPossibles(id: Int! , listUsers:ListPossibleMatchInput!):ListPossibleFiltered!
`;

const url = process.env.AUTH_URL || 'users-ms';
const port = process.env.AUTH_PORT || '4001';
const entryPoint = process.env.AUTH_ENTRY || 'ldap';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
    Mutation: {
        auth: (_, { auth }) =>
            generalRequest(`${URL}`, 'POST', auth)
    }
};

const url$1 = process.env.LUGARES_URL || 'lugares_ms';
//export const url = process.env.LUGARES_URL || '35.227.46.47';
const port$1 = process.env.LUGARES_PORT || '4005';
const entryPoint$1 = process.env.LUGARES_ENTRY || 'lugares';

const URL$1 = `http://${url$1}:${port$1}/${entryPoint$1}`;

const resolvers$1 = {
	Query: {
		alllugares: (_) =>
			getRequest(URL$1, ''),
			 //generalRequest(`${URL}/`, 'GET'),
		lugarById: (_, { id }) =>
			generalRequest(`${URL$1}/${id}`, 'GET'),
	},
	Mutation: {
		createLugar: (_, { course }) =>
			generalRequest(`${URL$1}`, 'POST', course),
		updateLugar: (_, { id, course }) =>
			generalRequest(`${URL$1}/${id}`, 'PUT', course),
		deleteLugar: (_, { id }) =>
			generalRequest(`${URL$1}/${id}`, 'DELETE')
	}
};

const url$2 = process.env.CITAS_URL || 'citas-ms';
//export const url = process.env.CITAS_URL || '35.227.46.47';
const port$2 = process.env.CITAS_PORT || '4002';
const entryPoint$2 = process.env.CITAS_ENTRY || 'citas';

const URL$2 = `http://${url$2}:${port$2}/${entryPoint$2}`;

const resolvers$2 = {
	Query: {
		citaById: (_, { id }) =>
			generalRequest(`${URL$2}/${id}`, 'GET'),
		citaByPersonaId: (_, { id }) =>
			generalRequest(`${URL$2}/personas/${id}`, 'GET'),
	},
	Mutation: {
		createCita: (_, { cita }) =>
			generalRequest(`${URL$2}`, 'POST', cita),
		updateCita: (_, { id, cita }) =>
			generalRequest(`${URL$2}/${id}`, 'PUT', cita),
		deleteCita: (_, { id }) =>
			generalRequest(`${URL$2}/${id}`, 'DELETE')
	}
};

const url$3 = process.env.GUSTOS_URL || 'gustos_ms';
//export const url = process.env.GUSTOS_URL || '35.227.46.47';
const port$3 = process.env.GUSTOS_PORT || '4006';
const entryPoint$3 = process.env.GUSTOS_ENTRY || '';

const URL$3 = `http://${url$3}:${port$3}/${entryPoint$3}`;

const resolvers$3 = {
	Query: {
		allCategories: (_) =>
			getRequest(`${URL$3}categories`, ''),
		categoryById: (_, { id }) =>
			generalRequest(`${URL$3}categories/${id}`, 'GET'),
		categoriesByName: (_, { name }) =>
			generalRequest(`${URL$3}categories?by_name=${name}`, 'GET'),
		allSubcategories: (_) =>
			getRequest(`${URL$3}subcategories`, ''),
		subcategoryById: (_, { id }) =>
			generalRequest(`${URL$3}subcategories/${id}`, 'GET'),
		subcategoriesByCategory: (_, { category_id }) =>
			generalRequest(`${URL$3}subcategories?by_category=${category_id}`, 'GET'),
		subcategoriesByName: (_, { name }) =>
			generalRequest(`${URL$3}subcategories?by_name=${name}`, 'GET'),
		allPleasures: (_) =>
			getRequest(`${URL$3}pleasures`, ''),
		pleasureById: (_, { id }) =>
			generalRequest(`${URL$3}pleasures/${id}`, 'GET'),
		pleasuresBySubcategory: (_, { subcategory_id }) =>
			generalRequest(`${URL$3}pleasures?by_subcategory=${subcategory_id}`, 'GET'),
		pleasureByUser: (_, { user_id }) =>		
			generalRequest(`${URL$3}pleasures?by_user=${user_id}`, 'GET'),		        
		pleasuresByCategory: (_, { category_id }) =>
		        generalRequest(`${URL$3}pleasures?by_category=${category_id}`, 'GET'),
		pleasuresByName: (_, { name }) =>
		        generalRequest(`${URL$3}pleasures?by_name=${name}`, 'GET')
	},
	Mutation: {
		createCategory: (_, { category }) =>
			generalRequest(`${URL$3}categories`, 'POST', category),
		updateCategory: (_, { id, category }) =>
			generalRequest(`${URL$3}categories/${id}`, 'PUT', category),
		deleteCategory: (_, { id }) =>
			generalRequest(`${URL$3}categories/${id}`, 'DELETE'),
		createSubcategory: (_, { subcategory }) =>
			generalRequest(`${URL$3}subcategories`, 'POST', subcategory),
		updateSubcategory: (_, { id, subcategory }) =>
			generalRequest(`${URL$3}subcategories/${id}`, 'PUT', subcategory),
		deleteSubcategory: (_, { id }) =>
			generalRequest(`${URL$3}subcategories/${id}`, 'DELETE'),
		createPleasure: (_, { pleasure }) =>
			generalRequest(`${URL$3}pleasures`, 'POST', pleasure),
		updatePleasure: (_, { id, pleasure }) =>
			generalRequest(`${URL$3}pleasures/${id}`, 'PUT', pleasure),
		deletePleasure: (_, { id }) =>
			generalRequest(`${URL$3}pleasures/${id}`, 'DELETE')
	}
};

const url$4 = process.env.USUARIOS_URL || 'users-ms';
const port$4 = process.env.USUARIOS_PORT || '4001';
const entryPoint$4 = process.env.USUARIOS_ENTRY || 'users';

const URL$4 = `http://${url$4}:${port$4}/${entryPoint$4}`;

const resolvers$4 = {
	Query: {
		allUsers: (_) =>
			getRequest(URL$4, ''),
		userById: (_, { id }) =>
			generalRequest(`${URL$4}/${id}`, 'GET'),
	},
	Mutation: {
		createToken: (_, { aut }) =>
			generalRequest(`http://${url$4}:${port$4}/user_token`, 'POST', aut),
		createUser: (_, { user }) =>
			generalRequest(`${URL$4}`, 'POST', user),
		updateUser: (_, { id, user }) =>
			generalRequest(`${URL$4}/${id}`, 'PUT', user),
		deleteUser: (_, { id }) =>
			generalRequest(`${URL$4}/${id}`, 'DELETE')
	}
};

const url$5 = process.env.MATCH_URL || 'match-ms';
//export const url = process.env.MATCH_URL || '35.227.46.47';
const port$5 = process.env.MATCH_PORT || '4003';
const entryPoint$5 = process.env.MATCH_ENTRY || 'match';

const URL$5 = `http://${url$5}:${port$5}/${entryPoint$5}`;

const resolvers$5 = {
	Query: {
		allMatch: (_) =>
			getRequest(URL$5, ''),
		matchById: (_, { id }) =>
			generalRequest(`${URL$5}/${id}`, 'GET'),
	},
	Mutation: {
		createMatch: (_, { match }) =>
			generalRequest(`${URL$5}/`, 'POST', match),
		filtrateListPossibles: (_, {id, listUsers }) =>
			generalRequest(`${URL$5}/posibles/${id}`, 'POST', listUsers)
	}
};

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		lugaresTypeDef,
		citasTypeDef,		
		usuariosTypeDef,
		gustosTypeDef,
		matchTypeDef,
		authTypeDef
	],
	[
		lugaresQueries,
		citasQueries,
		usuariosQueries,
		gustosQueries,
		matchQueries
	],
	[
		lugaresMutations,
		citasMutations,
		usuariosMutations,
		gustosMutations,
		matchMutations,
		authMutations
	]
);

// Generate the schema object from your types definition.
var graphQLSchema = graphqlTools.makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		resolvers$1,resolvers$2,resolvers$4,
		resolvers$3, resolvers$5,resolvers
	)
});

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 5000;

app.use(koaLogger());
app.use(koaCors());

// read token from header
app.use(async (ctx, next) => {
	if (ctx.header.authorization) {
		const token = ctx.header.authorization.match(/Bearer ([A-Za-z0-9]+)/);
		if (token && token[1]) {
			ctx.state.token = token[1];
		}
	}
	await next();
});

// GraphQL
const graphql$1 = apolloServerKoa.graphqlKoa((ctx) => ({
	schema: graphQLSchema,
	context: { token: ctx.state.token },
	formatError: formatErr
}));
router.post('/graphql', koaBody(), graphql$1);
router.get('/graphql', graphql$1);

// test route
router.get('/graphiql', apolloServerKoa.graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
