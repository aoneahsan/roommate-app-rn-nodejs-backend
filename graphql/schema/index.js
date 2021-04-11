// Core Imports
const { buildSchema } = require("graphql");

// Custom Imports

module.exports = buildSchema(`
input loginInput {
    email: String!
    password: String!
}

input registerInput {
    full_name: String
    username: String!
    email: String!
    password: String!
    tag_line: String
    status: String
    role: String!
}

type RoleModal {
    _id: ID
    title: String
    description: String
    createdAt: String
    updatedAt: String
}

type UserModal {
    _id: ID
    full_name: String
    username: String!
    email: String!
    password: String
    tag_line: String
    status: String
    last_seen: String
    role: RoleModal
    contacts: [UserModal]
    createdAt: String
    updatedAt: String
    token: String
}

type MessageModal {
    _id: ID
    title: String
    description: String
    image: String
    members: [UserModal]
    last_message: String
    createdAt: String
    updatedAt: String
}

type GroupModal {
    _id: ID
    title: String
    description: String
    image: String
    members: [UserModal]
    last_message: [MessageModal]
    createdAt: String
    updatedAt: String
}

type RootQuery {
    hello: String
    getProfileData: UserModal
}

type RootMutation {
    login(userInput: loginInput): UserModal!
    register(userInput: registerInput): UserModal!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
