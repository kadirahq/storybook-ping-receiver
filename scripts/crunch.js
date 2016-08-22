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
      //"trackedAt": {$max: "$trackedAt"}
    }
  },
  // {
  //   $group: {
  //     _id: {
  //       "year": "$_id.year",
  //       "month": "$_id.month",
  //       "day": "$_id.day"
  //     },
  //     count: {$sum: 1}
  //   }
  // }
]).toArray();

var resultsGroupedByDay = _(results).groupBy(function(doc) {
  return new Date(doc._id.year, doc._id.month, doc._id.day);
});

_(_(resultsGroupedByDay).mapObject(function(val) {
  return val.length;
})).mapObject(function(val, key) {
  db.statistics.update(
    {
      date: new Date(key),
      type: "count"
    },
    {
      $set: {count: val}
    },
    {
      upsert: true
    }
  );
});

// .forEach(function(doc) {
//   db.statistics.update({
//     year: doc._id.year,
//     month: doc._id.month,
//     day: doc._id.day
//   }, {
//     $set: {count: doc.count}
//   }, {
//     upsert: true
//   });
// });
