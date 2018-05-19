export const matchTypeDef = `
type Match {
    id: Int!
    id_user_one: Int!
    id_user_two: Int!
    state_user_one: Int!
    state_user_two: Int!

}

input MatchInput {
    id_user_one: Int!
    id_user_two: Int!
    state_user_one: Int!
}



type PleasureMatch {
    name: String!
    description: String!
    user_id: Int!
    subcategory_id: Int!
}

input ListPossibleMatchInput {
    listUsers:[Int]!
}


type ListPossibleFiltered {
    listUsersFiltered:[Int]!
}
`;

export const matchQueries = `
    allMatch: [Match]!
    matchById(id: Int!): Match!
`;

export const matchMutations = `
    createMatch(match: MatchInput!): Match!
    filtrateListPossibles(id: Int! , listUsers:ListPossibleMatchInput!):ListPossibleFiltered!
`;
