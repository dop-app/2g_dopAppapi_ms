export const gustosTypeDef = `
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

export const gustosQueries = `
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

export const gustosMutations = `
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
