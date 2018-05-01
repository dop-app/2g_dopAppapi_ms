import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allCategories: (_) =>
			getRequest(`${URL}categories`, ''),
		categoryById: (_, { id }) =>
			generalRequest(`${URL}categories/${id}`, 'GET'),
		categoriesByName: (_, { name }) =>
			generalRequest(`${URL}categories?by_name=${name}`, 'GET'),
		allSubcategories: (_) =>
			getRequest(`${URL}subcategories`, ''),
		subcategoryById: (_, { id }) =>
			generalRequest(`${URL}subcategories/${id}`, 'GET'),
		subcategoriesByCategory: (_, { category_id }) =>
			generalRequest(`${URL}subcategories?by_category=${category_id}`, 'GET'),
		subcategoriesByName: (_, { name }) =>
			generalRequest(`${URL}subcategories?by_name=${name}`, 'GET'),
		allPleasures: (_) =>
			getRequest(`${URL}pleasures`, ''),
		pleasureById: (_, { id }) =>
			generalRequest(`${URL}pleasures/${id}`, 'GET'),
		pleasuresBySubcategory: (_, { subcategory_id }) =>
			generalRequest(`${URL}pleasures?by_subcategory=${subcategory_id}`, 'GET'),
		pleasureByUser: (_, { user_id }) =>
			generalRequest(`${URL}pleasures?by_user=${user_id}`, 'GET'),
		pleasuresByCategory: (_, { category_id }) =>
			generalRequest(`${URL}pleasures?by_category=${category_id}`, 'GET'),
		pleasuresByName: (_, { name }) =>
			generalRequest(`${URL}pleasures?by_name=${name}`, 'GET')
	},
	Mutation: {
		createCategory: (_, { category }) =>
			generalRequest(`${URL}categories`, 'POST', category),
		updateCategory: (_, { id, category }) =>
			generalRequest(`${URL}categories/${id}`, 'PUT', category),
		deleteCategory: (_, { id }) =>
			generalRequest(`${URL}categories/${id}`, 'DELETE'),
		createSubcategory: (_, { subcategory }) =>
			generalRequest(`${URL}subcategories`, 'POST', subcategory),
		updateSubcategory: (_, { id, subcategory }) =>
			generalRequest(`${URL}subcategories/${id}`, 'PUT', subcategory),
		deleteSubcategory: (_, { id }) =>
			generalRequest(`${URL}subcategories/${id}`, 'DELETE'),
		createPleasure: (_, { pleasure }) =>
			generalRequest(`${URL}pleasures`, 'POST', pleasure),
		updatePleasure: (_, { id, pleasure }) =>
			generalRequest(`${URL}pleasures/${id}`, 'PUT', pleasure),
		deletePleasure: (_, { id }) =>
			generalRequest(`${URL}pleasures/${id}`, 'DELETE')
	}
};

export default resolvers;
