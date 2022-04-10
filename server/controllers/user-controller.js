// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');
const {AuthenticationError} = require("apollo-server-express");

module.exports = {
  // get a single user by either their id or their username
  async getSingleUser(_,__,context) {
    console.log(context.user)
    if(!context.user){
      throw new AuthenticationError('You are not logged in')
    }
    try{
      const foundUser = await User.findOne({ _id: context.user._id });
      if (!foundUser) {
        throw new AuthenticationError('Cannot find a user with this id!')
      }
      return foundUser;
    }catch (e) {
      throw new AuthenticationError(JSON.stringify(e))
    }

  },

  // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
  async createUser(_,{user:userInput}) {
    try{
      const user = await User.create(userInput);
      if (!user) {
        throw new AuthenticationError('Something is wrong!')
      }
      const token = signToken(user);
      return { token, user };
    }catch (e) {
      throw new AuthenticationError(e)
    }
  },

  // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
  // {body} is destructured req.body
  async login(_, {loginInput: {username = null, email = null, password}}) {
    console.log(username,email,password)
    try{
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (!user) {
        throw new AuthenticationError('Cannot find this user')
      }
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('wrong password')
      }
      const token = signToken(user);
      return { token, user };
    }catch(e){
      throw new AuthenticationError(JSON.stringify(e))
    }
  },


  // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
  // user comes from `req.user` created in the auth middleware function
  async saveBook(_,{ book }, context) {
    if(!context.user){
      throw new AuthenticationError('User is not logged in')
    }
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    } catch (e) {
      throw new AuthenticationError(JSON.stringify(e))

    }
  },

  // remove a book from `savedBooks`
  async deleteBook(_,{bookId}, context) {
    if(!context.user){
      throw new AuthenticationError('User is not logged in')
    }
    try{
      const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId} } },
          { new: true }
      );
      if (!updatedUser) {
        throw new AuthenticationError('Could not find user with this id')
      }
      return updatedUser;
    }catch (e) {
      throw new AuthenticationError(JSON.stringify(e))
    }

  },
};
