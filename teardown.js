server.post('/teardown', function(req, res, next) {
  var connection_teardown = mysql.createConnection({
    host: dbhost,
    user: dbuser
  });
  
  connection_teardown.connect();

  var query1 = "DROP database " + database;
  connection_teardown.query(query1, function(err, rows, fields) {
    if (err) {
      console.log("Error dropping database: " + err);
      res.send(500);
    }

    res.send(200);
  });

  connection_teardown.end();
})
