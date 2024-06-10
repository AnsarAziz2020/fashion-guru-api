const mysql = require('mysql');
const fs = require('fs');
// const https = require('https');

// MySQL Connection Configuration
// const connection = mysql.createConnection({
//      host: 'fashionguru.cquwniqq9cri.eu-north-1.rds.amazonaws.com',
//      user: 'admin',
//      password: 'arish1199',
//      database: 'db_fashion_guru',
//  });

 const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_fashion_guru',
});

//var connection=mysql.createConnection({host:"fashion-guru-s1.mysql.database.azure.com", user:"MadDogGoldFish", password:"iArish@786", database:"fashion_guru", port:3306,ssl:{ca:fs.readFileSync("security/DigiCertGlobalRootCA.crt.pem")}});

// Create a MySQL connection pool
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });

module.exports = connection;

