export const citasTypeDef = `
type Cita {
    id:          Int!
    cita:        String!
    lugar:       Int!
    fecha:       String!
    personas:    [Int]!
    estado:      String!
    visibilidad: Boolean!
}
input CitaInput {
    cita:        String!
    lugar:       Int!
    fecha:       String!
    personas:    [Int]!
    estado:      String!
    visibilidad: Boolean!
}
`;

export const citasQueries = `
  citaById(id: Int!): Cita!
  citaByPersonaId(id: Int!): [Cita]!
`;

export const citasMutations = `
    createCita(cita: CitaInput!): Cita!
    deleteCita(id: Int!): Cita!
    updateCita(id: Int!, cita: CitaInput!): Cita!
`;
