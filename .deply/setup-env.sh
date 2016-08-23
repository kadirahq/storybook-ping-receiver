heroku config:set \
       MONGO_URL=${STORYBOOK_PING_MONGO_URL} \
       AUTH_SECRET=${STORYBOOK_PING_AUTH_SECRET} \
       --app storybook-ping-receiver
