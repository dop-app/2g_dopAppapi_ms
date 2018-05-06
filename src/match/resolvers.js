import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allMatch: (_) =>
			getRequest(URL, ''),
		matchById: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'GET'),
	},
	Mutation: {
		createMatch: (_, { match }) =>
			generalRequest(`${URL}/`, 'POST', match),
		filtrateListPossibles: (_, {id, listUsers }) =>
			generalRequest(`${URL}/posibles/${id}`, 'POST', listUsers)
	}
};

export default resolvers;