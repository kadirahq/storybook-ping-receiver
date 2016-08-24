"use strict"
let datalayer;

module.exports.initDataLayer = function(db) {
  datalayer = new this.DataLayer(db);
};

module.exports.getDataLayer = function(){
  return datalayer;
};

module.exports.DataLayer = class DataLayer {
  constructor(db){
    this.db = db;
    this.stats = this.db.collection('statistics');
    this.users = this.db.collection('users');
  }

  getTotalUsers(from, to) {
    var results = this.stats.aggregate([
      {
        $match: {
          "date": {
            $gte: new Date(from),
            $lt: new Date(to)
          },
          "type": "count"
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: "$count" },
          from: { $min: "$date" },
          to: { $max: "$date" }
        }
      }
    ])
          .toArray()
          .then(function(docs) {
            if(docs.length) {
              return {
                _id: docs[0]._id,
                count: docs[0].count,
                from: new Date(docs[0].from).getTime(),
                to: new Date(docs[0].to).getTime()
              };
            } else {
              return null;
            }
          });
    return results;
  }

  getNewUsers(from, to) {
    var results = this.users.find({
      firstTrackedAt: {
        $gte: new Date(from),
        $lt: new Date(to)
      }
    }).count();

    return {
      from: from,
      to: to,
      count: results
    };
  }

  getChurnedUsers(duration) {
    var duration = duration || 1000 * 60 * 60 * 24 * 7;
    var results = this.users.aggregate([
      {
        $redact: {
          $cond: {
            if: {
              $gt: [
                { $subtract: [ new Date(), "$lastTrackedAt" ] },
                duration
              ]
            },
            then: "$$DESCEND",
            else: "$$PRUNE"
          }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ])
          .toArray()
          .then(function(docs) {
            var to = new Date().getTime();
            var from = to - duration;
            return {
              from: from,
              to: to,
              count: docs[0].count
            };
          });

  //   var results = db.users.aggregate([
  //     {
  //       $project: {
  //         diff: {
  //           $subtract: [ new Date(), "$lastTrackedAt"]
  //         }
  //       }
  //     },
  //     {
  //       $match: {
  //         diff: {
  //           $gt: 1000 * 60 * 60 * 24 * 7
  //         }
  //       }
  //     },
  //     {
  //       $group: {
  //         _id: null,
  //         count: { $sum: 1 }
  //       }
  //     }
    //   ]);
    return results;
  }

};
