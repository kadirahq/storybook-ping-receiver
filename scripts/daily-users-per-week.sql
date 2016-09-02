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
      date_add(UTC_USEC_TO_TIMESTAMP(UTC_USEC_TO_DAY(NOW())), -7, "DAY")
      AND UTC_USEC_TO_TIMESTAMP(UTC_USEC_TO_DAY(NOW()))
)
GROUP BY day, month
ORDER BY month DESC, day DESC
