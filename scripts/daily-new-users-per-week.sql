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
    date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -7, "DAY")
      AND
      date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), 0, "DAY")
GROUP BY day, month, year
ORDER BY year, month, day DESC
