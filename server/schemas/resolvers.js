const {getSingleUser, login, createUser, deleteBook, saveBook} = require('../controllers/user-controller')

const resolvers = {
    Query: {
        getSingleUser: getSingleUser,
    },
    Mutation: {
        login: login,
        createUser: createUser,
        saveBook: saveBook,
        deleteBook: deleteBook
    }
}


module.exports = resolvers