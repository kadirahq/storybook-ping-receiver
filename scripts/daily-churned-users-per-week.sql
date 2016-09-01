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
  date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -7, "DAY")
      AND
      date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -0, "DAY")
GROUP BY day, month, year
ORDER BY day DESC, month DESC, year DESC
