import {gql} from "@apollo/client";


export const CREATE_USER = gql`
    mutation CreateUser($user: createUserInput!) {
        createUser(user: $user) {
            token
            user {
                username
                email
            }
        }
    }
`

export const LOGIN_USER = gql`
    mutation Login($loginInput: loginInput) {
        login(loginInput: $loginInput) {
            token
            user {
                username
                email
            }
        }
    }`

// save book data for a logged in user
export const SAVE_BOOK = gql`
    mutation SaveBook($book: saveBookInput) {
        saveBook(book: $book) {
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
    }`

// remove saved book data for a logged in user
export const DELETE_BOOK = gql`
    mutation DeleteBook($bookId: String!) {
        deleteBook(bookId: $bookId) {
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
    }`