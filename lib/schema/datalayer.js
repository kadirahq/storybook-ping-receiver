let datalayer;

module.exports.initDataLayer = function(db) {
  datalayer = new this.DataLayer(db);
};

module.exports.getDataLayer = function(){
  return datalayer;
};

module.exports.DataLayer = class DataLayer {
  constructor(db){
    this.db = db,
    this.stats = this.db.collection('statistics')
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

};
