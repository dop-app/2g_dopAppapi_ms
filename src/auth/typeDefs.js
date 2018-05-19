export const authTypeDef = `

    type auth {
        email: String!
        password: String!
        answer: String!
    }
    input AuthInput {
        email: String!
        password: String!
    }

    type log{
        auth: auth!
        token: String        
        id: Int
    }
`;

export const authMutations = `
    auth(auth: AuthInput!): log!
`;