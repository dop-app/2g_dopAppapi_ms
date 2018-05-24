export const lugaresTypeDef = `

input inputPoint
{
    type: String!
    coordinates: [Float]!
    index: String!
}

type Point
{
    type: String!
    coordinates: [Float]!
    index: String!
}

type Lugar {
    _id: Int!
    nombre: String!
    nivelPrecio: String!
    ubicacion: Point!
    direccion: String
    horario: String
    calificacion: String
    tipo: String
    ciudad: String
    pais: String

}


input LugarInput {
    nombre: String!
    nivelPrecio: String!
    ubicacion: inputPoint!
    direccion: String
    horario: String
    calificacion: String
    tipo: String
    ciudad: String
    pais: String
}
`;

export const lugaresQueries = `
    alllugares: [Lugar]!  
    lugarById(id: String!): Lugar! 
`;

export const lugaresMutations = `
    createLugar(lugar: LugarInput): Lugar!
    deleteLugar(id: Int!): Lugar!
    updateLugar(id: Int!): Lugar!
`;
