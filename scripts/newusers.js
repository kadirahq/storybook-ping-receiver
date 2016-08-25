var usersBulk = db.users.initializeUnorderedBulkOp();

_(results)
  .mapObject(function(doc) {
    usersBulk.find({
      "_id": doc._id.userId || null
    })
      .upsert()
      .update({
        $min: {
          firstTrackedAt: doc.trackedAtMin
        },
        $max: {
          lastTrackedAt: doc.trackedAtMax
        }
      });
  });

usersBulk.execute();
