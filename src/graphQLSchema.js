import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
	lugaresMutations,
	lugaresQueries,
	lugaresTypeDef
} from './lugares/typeDefs';

import {
	usuariosMutations,
	usuariosQueries,
	usuariosTypeDef
} from './usuarios/typeDefs';

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
	emparejadoresMutations,
	emparejadoresQueries,
	emparejadoresTypeDef
} from './emparejadores/typeDefs';




import lugaresResolvers from './lugares/resolvers';
import usuariosResolvers from './usuarios/resolvers';
import citasResolvers from './citas/resolvers';
import gustosResolvers from './gustos/resolvers';
import emparejadoresResolvers from './emparejadores/resolvers';

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		lugaresTypeDef,
		usuariosTypeDef,
		citasTypeDef,
		gustosTypeDef,
		emparejadoresTypeDef
	],
	[
		lugaresQueries,
		usuariosQueries,
		citasQueries,
		gustosQueries,
		emparejadoresQueries
	],
	[
		lugaresMutations,
		usuariosMutations,
		citasMutations,
		gustosMutations,
		emparejadoresMutations
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		lugaresResolvers,usuariosResolvers,citasResolvers,gustosResolvers,emparejadoresResolvers
	)
});
