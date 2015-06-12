var connURL = "mongodb://lalitisbhatia:adana1234@oceanic.mongohq.com:10089/pilot2db";
var dbName = "/pilot2db";

//var connURL = "mongodb://localhost/pilot2db";

var MongoClient = require('mongodb').MongoClient;

var db_singleton = null;

exports.getConnection= function getConnection(callback)
{
    if (db_singleton)
    {
        callback(null,db_singleton);
    }
    else
    {
           //placeholder: modify this-should come from a configuration source
        
        MongoClient.connect(connURL,function(err,db){

            if(err)
                console.log("Error creating new connection "+err);
            else
            {
                db_singleton=db;    
                console.log("created new connection");

            }
            callback(err,db_singleton);
            return;
        });
    }
}


//module.exports.connURL = connURL;
