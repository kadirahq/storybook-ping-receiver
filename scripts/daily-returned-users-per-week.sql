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
  date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), -7, "DAY")
      AND
      date_add(utc_usec_to_timestamp(utc_usec_to_day(now())), 0, "DAY")
GROUP BY day, month, year
ORDER BY day DESC, month DESC, year DESC
