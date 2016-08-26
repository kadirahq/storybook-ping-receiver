"use strict"
var googleapis = require('googleapis');
var bigquery = googleapis.bigquery("v2");

let datalayer;

module.exports.initDataLayer = function(config) {
  datalayer = new this.DataLayer(config);
};

module.exports.getDataLayer = function(){
  return datalayer;
};

module.exports.DataLayer = class DataLayer {
  constructor(config){
    this.config = config;
    this.jwtClient = new googleapis.auth.JWTClient(
      config.client_email,
      null,
      config.private_key,
      [
        "https://www.googleapis.com/auth/bigquery.insertdata",
      ],
      null
    );
  }

  insertAll(tableId, rows) {
    var request = {
      auth: this.jwtClient,
      projectId: this.config.project_id,
      datasetId: "storybook_ping_data",
      tableId: tableId,
      "kind": "bigquery#tableDataInsertAllRequest",
      ignoreUnknownValues: true,
      resource: {
        rows: rows
      }
    };
    bigquery.tabledata.insertAll(request, function(err, result) {
      if(err) {
      console.error('Error inserting to ' + tableId, err);
      }
    });
  }
};
