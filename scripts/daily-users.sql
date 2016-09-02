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
