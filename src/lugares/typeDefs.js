export const lugaresTypeDef = `
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

type Point
{
    type: String!
    coordinates: [Float]!
    index: String!
}

input LugarInput {
    code: Int!
    name: String!
    credits: Int!
}
`;

export const lugaresQueries = `
    alllugares: [Lugar]!  
    lugarById(id: String!): Lugar! 
`;

 

export const lugaresMutations = `
    createLugar(id: String): Lugar!
    deleteLugar(id: String!): Lugar!
    updateLugar(id: String!): Lugar!
`;
