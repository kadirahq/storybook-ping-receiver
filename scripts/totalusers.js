var date = new Date();
var endTime = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
var startTime = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1);

var results = db.pings.aggregate([
  {
    $match: {
      "trackedAt": {
        $gte: startTime,
        $lte: endTime
      }
    }
  },
  {
    $group: {
      _id:{
        "userId": "$userId",
        "year": { $year: "$trackedAt"},
        "month": { $month: "$trackedAt"},
        "day": { $dayOfMonth: "$trackedAt"}
      },
      "trackedAtMin": {$min: "$trackedAt"},
      "trackedAtMax": {$max: "$trackedAt"}
    }
  },
]).toArray();

var resultsGroupedByDay = _(results).groupBy(function(doc) {
  var date = new Date(Date.UTC(doc._id.year, doc._id.month - 1, doc._id.day));
  return date;
});

_(resultsGroupedByDay).mapObject(function(val, key) {
  db.statistics.update(
    {
      date: new Date(key),
      type: "count"
    },
    {
      $set: {count: val.length}
    },
    {
      upsert: true
    }
  );
});
