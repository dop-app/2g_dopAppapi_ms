import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
    authMutations,
    authTypeDef
} from './auth/typeDefs';


import {
	lugaresMutations,
	lugaresQueries,
	lugaresTypeDef
} from './lugares/typeDefs';

import {
	citasMutations,
	citasQueries,
	citasTypeDef
} from './citas/typeDefs';

import {
	gustosMutations,
	gustosQueries,
	gustosTypeDef
} from './gustos/typeDefs';

import {
	usuariosMutations,
	usuariosQueries,
	usuariosTypeDef
} from './usuarios/typeDefs';

import {
	matchMutations,
	matchQueries,
	matchTypeDef
} from './match/typeDefs';

import authResolvers from './auth/resolvers';
import lugaresResolvers from './lugares/resolvers';
import citasResolvers from './citas/resolvers';
import gustosResolvers from './gustos/resolvers';
import usuariosResolvers from './usuarios/resolvers';
import matchResolvers from './match/resolvers';

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
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		lugaresResolvers,citasResolvers,usuariosResolvers,
		gustosResolvers, matchResolvers,authResolvers
	)
});
