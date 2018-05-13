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

type valid{
    valid: Boolean!
}

`;

export const usuariosQueries = `
    allUsers: [User]
    userById(id: Int!): User
    validation(idsession:Int!,token:String!): valid!
`;

export const usuariosMutations = `    
    createUser(user: UserInput!): User!
    deleteUser(id: Int!): User!
    updateUser(id: Int!, user: UserInput!): User! 

`;

//createToken(auth: autInput!): token!