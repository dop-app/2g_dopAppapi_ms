export const usuariosTypeDef = `
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

input autInput {
    auth: Auth
}

input Auth {
    email: String!
    password: String!
}

`;

export const usuariosQueries = `
    allUsers: [User]!
    userById(id: Int!): User!
`;

export const usuariosMutations = `
    
    createUser(user: UserInput!): User!
    deleteUser(id: Int!): User!
    updateUser(id: Int!, user: UserInput!): User! 

`;

//createToken(auth: autInput!): token!