import {gql} from "@apollo/client";

export const GET_SINGLE_USER = gql`
    query GetSingleUser {
        getSingleUser {
            username
            email
            savedBooks {
                authors
                description
                bookId
                image
                link
                title
            }
        }
    }`;