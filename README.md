# storybook-ping-receiver

Listen to anonymous usage pings sent from React Storybook.

Currently this only has two routes and save it directly to BigQuery.

## Running the app
* set GOOGLE\_JWT(string of the google cloud service account json key with BQ access EDIT/WRITE), AUTH\_SECRET(basic auth password for graphql api)
* `npm start`

## Running the queries
* Install google cloud sdk from [here](https://cloud.google.com/sdk/docs/quickstart-mac-os-x) or homebrew `brew install Caskroom/cask/google-cloud-sdl`
* Login and configure the project using `gcloud init`
* run the required query using `bq query "$(cat scripts/<script name>.sql)"`
* Adjust the `BETWEEN` parameters in the scripts to change the dates/windows etc..
