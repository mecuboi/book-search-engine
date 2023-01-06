const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../utils/auth')

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({
          _id: context.user._id
        })
          .populate('books');

        return userData
      }

      throw new AuthenticationError('Not logged in')
    },

  },
  Mutation: {
    createUser: async (parent, args) => {
      const newUser = await User.create(args);
      const token = signToken(newUser)
      return { token, newUser };
    },
    login: async (parent, args) => {
      const user = await User.findOne(args.email);

      if (!user) {
        throw new AuthenticationError('Wrong email or password!')
      }

      const correctPw = await user.isCorrectPassword(args.password);

      if (!correctPw) {
        throw new AuthenticationError('Wrong email or password!')
      }

      const token = signToken(user);

      return { token, user }

    },

    saveBook: async (parent, args, context) => {
      if (context.user) {
        const updateUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: {savedBooks: args.input}},
          { new: true, runValidators: true },
        );
        return updateUser
      }

      throw new AuthenticationError('Not logged in')
    },

    deleteBook: async (parent, args, context) => {
      if (context.user) {
        const updateUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: {savedBooks: {bookId: args.bookId}}},
          { new: true, runValidators: true },
        );
        return updateUser
      }
    }
  },
};

module.exports = resolvers;
