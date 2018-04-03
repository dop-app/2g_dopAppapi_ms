import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		alllugares: (_) =>
			getRequest(URL, ''),
			 //generalRequest(`${URL}/`, 'GET'),
		lugarById: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'GET'),
	},
	Mutation: {
		createLugar: (_, { course }) =>
			generalRequest(`${URL}`, 'POST', course),
		updateLugar: (_, { id, course }) =>
			generalRequest(`${URL}/${id}`, 'PUT', course),
		deleteLugar: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE')
	}
};

export default resolvers;
