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

type token {
    jwt: String   
}

input autInput {
    auth: aut
}

input aut {
    email: String!
    password: String!
}

`;

export const usuariosQueries = `
    allUsers: [User]!
    userById(id: Int!): User!
`;

export const usuariosMutations = `
    createToken(auth: autInput!): token!
    createUser(user: UserInput!): User!
    deleteUser(id: Int!): User!
    updateUser(id: Int!, user: UserInput!): User! 

`;