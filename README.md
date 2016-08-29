# storybook-ping-receiver

Listen to anonymous usage pings sent from React Storybook.

Currently this only has two routes and save it directly to BigQuery.


## Sample BigQuery SQL

### Daily users
Change `BETWEEN` parameters to change the window. Lists last weeks info.

```SQL
SELECT
  day(trackedAt) as day,
  month(trackedAt) as month,
  count(unique(userId)) as count
FROM (
  SELECT
    trackedAt,
    userId
  FROM [kadira-storybooks:storybook_ping_data.pings]
  WHERE trackedAt
    BETWEEN
      date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -7, "DAY")
      AND
      date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), 0, "DAY")
)
GROUP BY day, month
ORDER BY month DESC, day DESC
```

### Daily new users
Only lists last days results

```SQL
SELECT
  count(unique(userId)) as count
FROM [kadira-storybooks.storybook_ping_data.pings]
WHERE
  trackedAt
  BETWEEN date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -1, "DAY")
    AND date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), 0, "DAY")
  AND
  userId NOT IN(
    SELECT userId FROM [kadira-storybooks.storybook_ping_data.pings]
      WHERE
      trackedAt < date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -1, "DAY")
  )
```

### Daily churned users
Only lists last days results

```SQL
SELECT count(unique(userId)) as count
  FROM [kadira-storybooks.storybook_ping_data.pings]
  WHERE
    trackedAt
    BETWEEN date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -8, "DAY")
      AND date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -7, "DAY")
    AND
    userId NOT IN(
      SELECT userId FROM [kadira-storybooks.storybook_ping_data.pings]
        WHERE
          trackedAt
          BETWEEN date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -7, "DAY")
            AND date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), 0, "DAY")
    )
```

### Daily came back users
Only lists last days results

```SQL
SELECT count(unique(userId)) as count
  FROM [kadira-storybooks.storybook_ping_data.pings]
  WHERE
  trackedAt
    BETWEEN date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -1, "DAY")
      AND date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), 0, "DAY")
    AND
    userId NOT IN(
      SELECT userId FROM [kadira-storybooks.storybook_ping_data.pings]
        WHERE
          trackedAt
          BETWEEN date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -7, "DAY")
            AND date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -1, "DAY")
    )
    AND
    userId IN(
      SELECT userId FROM [kadira-storybooks.storybook_ping_data.pings]
        WHERE
          trackedAt < date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -7, "DAY")
    )
```
