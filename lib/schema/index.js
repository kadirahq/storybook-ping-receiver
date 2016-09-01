var graphql = require('graphql');
var datalayer = require('../datalayer');

var users = new graphql.GraphQLObjectType({
  name: 'Users',
  fields: {
    year: {type: graphql.GraphQLInt},
    month: { type: graphql.GraphQLInt },
    day: { type: graphql.GraphQLInt },
    count: { type: graphql.GraphQLInt }
  }
});

var rootQuery = new graphql.GraphQLObjectType({
  name: "rootQuery",
  fields: {
    totalUsers: {
      type: new graphql.GraphQLList(users),
      args: {
        from: { type: graphql.GraphQLFloat },
        to: { type: graphql.GraphQLFloat }
      },
      resolve: function(_, args) {
        return datalayer.getDataLayer().getTotalUsers(args.from, args.to);
      }
    },

    newUsers: {
      type: new graphql.GraphQLList(users),
      args: {
        from: { type: graphql.GraphQLFloat },
        to: { type: graphql.GraphQLFloat }
      },
      resolve: function(_, args) {
        return datalayer.getDataLayer().getNewUsers(args.from, args.to);
      }
    },

    churnedUsers: {
      type: new graphql.GraphQLList(users),
      args: {
        from: { type: graphql.GraphQLFloat },
        to: { type: graphql.GraphQLFloat }
      },
      resolve: function(_, args) {
        return datalayer.getDataLayer().getChurnedUsers(args.from, args.to);
      }
    },

    returnedUsers: {
      type: new graphql.GraphQLList(users),
      args: {
        from: { type: graphql.GraphQLFloat },
        to: { type: graphql.GraphQLFloat }
      },
      resolve: function(_, args) {
        return datalayer.getDataLayer().getReturnedUsers(args.from, args.to);
      }
    }
  }
});

module.exports.loadSchema = function() {
  var schema = new graphql.GraphQLSchema({
    query: rootQuery
  });
  return schema;
};
