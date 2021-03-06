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
