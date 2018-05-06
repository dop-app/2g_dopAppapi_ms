import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		citaById: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'GET'),
		citaByPersonaId: (_, { id }) =>
			generalRequest(`${URL}/personas/${id}`, 'GET'),
	},
	Mutation: {
		createCita: (_, { cita }) =>
			generalRequest(`${URL}`, 'POST', cita),
		updateCita: (_, { id, cita }) =>
			generalRequest(`${URL}/${id}`, 'PUT', cita),
		deleteCita: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE')
	}
};

export default resolvers;