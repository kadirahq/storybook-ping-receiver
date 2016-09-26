"use strict"
var BigQuery = require('@google-cloud/bigquery');
var lru = require('lru-cache');

let datalayer;
let cache;

module.exports.initDataLayer = function(config) {
  datalayer = new this.DataLayer(config);
  cache = lru({
    max: 100,
    maxAge: 1000 * 60 * 60 * 12
  });
};

module.exports.getDataLayer = function(){
  return datalayer;
};

module.exports.DataLayer = class DataLayer {
  constructor(config){
    this.config = config;
    this.bqclient = BigQuery({
      projectId: config.project_id,
      credentials: {
        client_email: config.client_email,
        private_key: config.private_key
      }
    });
    this.dataset = this.bqclient.dataset("storybook_ping_data");
  }

  insert(tableId, data) {
    var options = {
      ignoreUnknownValues: true,
      skipInvaliedRows: true
    };
    this.dataset.table(tableId).insert(
      data,
      options,
      function(err, insertErr, apiRes) {
        if(err) {
          console.error("Bigquery error :", JSON.stringify(err));
        }
        if(insertErr && insertErr.length) {
          console.error("Bigquery insert error : ", JSON.stringify(insertErr));
        }
      });
  }

  query(queryString) {
    return new Promise(
      function(resolve, reject) {
        var cached = cache.get(queryString);
        if(cached) {
          resolve(cached);
          return;
        }
        datalayer.bqclient.query(queryString, function(err, rows) {
          if(err) {
            reject(err);
          }
          cache.set(queryString, rows);
          resolve(rows);
        });
      }
    );
  }

  getTotalUsers(from, to) {
    var fromString = '';
    from = roundTimestampToDay(from);
    to = roundTimestampToDay(to);

    if (from) {
      fromString = `utc_usec_to_timestamp(utc_usec_to_day(${from * 1000}))`;
    } else {
      fromString = `date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -7, "DAY")`;
    }

    var toString = `utc_usec_to_timestamp(utc_usec_to_day(${to * 1000 || `now()`}))`;

    var queryString = `
      SELECT
      day(trackedAt) as day,
      month(trackedAt) as month,
      year(trackedAt) as year,
      count(unique(userId)) as count
      FROM (
        SELECT
        trackedAt,
        userId
        FROM [kadira-storybooks:storybook_ping_data.pings]
        WHERE trackedAt
        BETWEEN
        ${fromString}
        AND ${toString}
      )
      GROUP BY day, month, year
      ORDER BY month DESC, day DESC, year DESC
    `;

    return this.query(queryString);
  }

  getNewUsers(from, to) {
    var fromString = '';
    from = roundTimestampToDay(from);
    to = roundTimestampToDay(to);

    if (from) {
      fromString = `utc_usec_to_timestamp(utc_usec_to_day(${from * 1000}))`;
    } else {
      fromString = `date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -7, "DAY")`;
    }

    var toString = `utc_usec_to_timestamp(utc_usec_to_day(${to * 1000 || `now()`}))`;

    var queryString =`
    SELECT
    count(userId) as count,
    day,
    month,
    year
    FROM(
      SELECT
      userId,
      trackedAt,
      LAG(trackedAt, 1) OVER(PARTITION BY userId ORDER BY trackedAt) lastTrackedDay,
      day,
      month,
      year
      FROM (
        SELECT
        userId,
        day(trackedAt) as day,
        month(trackedAt) as month,
        year(trackedAt) as year,
        max(trackedAt) as trackedAt
        FROM [kadira-storybooks:storybook_ping_data.pings]
        GROUP BY userId, day, month, year
      )
    )
    WHERE lastTrackedDay IS NULL
    AND trackedAt
    BETWEEN
    ${fromString}
    AND
    ${toString}
    GROUP BY day, month, year
    ORDER BY year DESC, month DESC, day DESC
   `;

    return this.query(queryString);
  }

  getChurnedUsers(from, to) {
    var fromString = '';
    from = roundTimestampToDay(from);
    to = roundTimestampToDay(to);

    if (from) {
      fromString = `utc_usec_to_timestamp(utc_usec_to_day(${from * 1000}))`;
    } else {
      fromString = `date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -7, "DAY")`;
    }

    var toString = `utc_usec_to_timestamp(utc_usec_to_day(${to * 1000 || `now()`}))`;

    var queryString =`
    SELECT
    count(userId) as count,
    day,
    month,
    year
    FROM(
      SELECT
      userId,
      trackedAt,
      LEAD(trackedAt, 1) OVER(PARTITION BY userId ORDER BY trackedAt) nextTrackedDay,
      weekFromTrackedAt,
      day(weekFromTrackedAt) as day,
      month(weekFromTrackedAt) as month,
      year(weekFromTrackedAt) as year
      FROM (
        SELECT
        userId,
        day(trackedAt) as day,
        month(trackedAt) as month,
        year(trackedAt) as year,
        max(trackedAt) as trackedAt,
        max(date_add(trackedAt, 7, "DAY")) as weekFromTrackedAt
        FROM [kadira-storybooks:storybook_ping_data.pings]
        GROUP BY userId, day, month, year
      )
    )
    WHERE nextTrackedDay IS NULL
    AND weekFromTrackedAt
    BETWEEN
    ${fromString}
    AND
    ${toString}
    GROUP BY day, month, year
    ORDER BY day DESC, month DESC, year DESC
    `;

    return this.query(queryString);
  }

  getReturnedUsers(from, to) {
    var fromString = '';
    from = roundTimestampToDay(from);
    to = roundTimestampToDay(to);

    if (from) {
      fromString = `utc_usec_to_timestamp(utc_usec_to_day(${from * 1000}))`;
    } else {
      fromString = `date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -7, "DAY")`;
    }

    var toString = `utc_usec_to_timestamp(utc_usec_to_day(${to * 1000 || `now()`}))`;

    var queryString =`
    SELECT
    count(userId) as count,
    day(usec_to_timestamp(nextTrackedDay)) as day,
    month(usec_to_timestamp(nextTrackedDay)) as month,
    year(usec_to_timestamp(nextTrackedDay)) as year
    FROM(
      SELECT
      userId,
      trackedAt,
      LEAD(trackedAt, 1) OVER(PARTITION BY userId ORDER BY trackedAt) nextTrackedDay
      FROM (
        SELECT
        userId,
        day(trackedAt) as day,
        month(trackedAt) as month,
        year(trackedAt) as year,
        max(trackedAt) as trackedAt
        FROM [kadira-storybooks:storybook_ping_data.pings]
        GROUP BY userId, day, month, year
      )
    )
    WHERE datediff(utc_usec_to_timestamp(nextTrackedDay), usec_to_timestamp(trackedAt)) >= 7
    AND nextTrackedDay
    BETWEEN
    ${fromString}
    AND
    ${toString}
    GROUP BY day, month, year
    ORDER BY day DESC, month DESC, year DESC
    `;

    return this.query(queryString);
  }
};


function roundTimestampToDay(timestamp) {
  var d = new Date(timestamp);
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d.getTime() + 1000 * 60 * 60 * 24;
}
