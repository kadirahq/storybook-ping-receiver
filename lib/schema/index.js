var graphql = require('graphql');
var datalayer = require('./datalayer');

var users = new graphql.GraphQLObjectType({
  name: 'Users',
  fields: {
    from: { type: graphql.GraphQLFloat },
    to: { type: graphql.GraphQLFloat },
    count: { type: graphql.GraphQLInt }
  }
});

var rootQuery = new graphql.GraphQLObjectType({
  name: "rootQuery",
  fields: {
    totalUsers: {
      type: users,
      args: {
        from: { type: graphql.GraphQLFloat },
        to: { type: graphql.GraphQLFloat }
      },
      resolve: function(_, args) {
        var to = args.to || new Date();
        var from = args.from || new Date(to - 1000 * 60 * 60 * 24 * 2);
        return datalayer.getDataLayer().getTotalUsers(from, to);
      }
    }
  }
});

module.exports.loadSchema = function(db) {
  datalayer.initDataLayer(db);
  var schema = new graphql.GraphQLSchema({
    query: rootQuery
  });
  return schema;
};
