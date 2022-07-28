import { gql } from 'apollo-server';

export const typeDef = gql`
    type Query {
        hello: String
    }
`;