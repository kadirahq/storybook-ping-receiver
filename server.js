var appLoader = require('./lib/app');

var port = process.env.PORT || 22022;

var app = appLoader();
console.info('"Storybook Ping Receiver" started on port: %d', 22022);
app.listen(port);
