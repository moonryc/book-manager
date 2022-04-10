const {gql} = require('apollo-server-express');


const typeDefs = gql`

    type Auth{
        token:ID!
        user:User
    }
    
    type Book{
        authors:[String],
        description:String!,
        bookId:String!,
        image:String,
        link:String,
        title:String!
    }
    
    type User{
        username:String,
        email:String,
        savedBooks:[Book]
    }

    input createUserInput{
        username:String!,
        email:String!,
        password:String!
    }
    input loginInput{
        username:String,
        email:String,
        password:String!
    }
    
    input saveBookInput{
        authors:[String],
        description:String!,
        bookId:String!,
        image:String,
        link:String,
        title:String!
    }
    
    type Query{
        getSingleUser:User,
    }
    
    type Mutation{
        login(loginInput:loginInput):Auth,
        createUser(user:createUserInput!):Auth,
        saveBook(book:saveBookInput):User,
        deleteBook(bookId:String!):User
    }
`;

module.exports = typeDefs