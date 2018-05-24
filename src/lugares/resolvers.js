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
		createLugar: (_, { lugar }) =>
			generalRequest(`${URL}`, 'POST', lugar),
		updateLugar: (_, { id, lugar }) =>
			generalRequest(`${URL}/${id}`, 'PUT', lugar),
		deleteLugar: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE')
	}
};

export default resolvers;
