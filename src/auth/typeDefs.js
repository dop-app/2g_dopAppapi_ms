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
        token: String
        auth: auth!
    }
`;

export const authMutations = `
    auth(auth: AuthInput!): log!
`;