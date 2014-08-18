// ---- server setup ----
GLOBAL.server = restify.createServer({ name: 'momoney-test' })
 
server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url)
})

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())
// -------- 


// ---- database setup ----
GLOBAL.connection = mysql.createConnection({
    host: dbhost,
    user: dbuser,
    database: database
  });

GLOBAL.connect = function() {
  connection.end();
  connection = mysql.createConnection({
    host: dbhost,
    user: dbuser,
    database: database
  });
  
  connection.connect();
}
// --------


// ---- setup ----
server.post('/setup', function(req, res, next) {
  var connection_setup = mysql.createConnection({
    host: dbhost,
    user: dbuser
  });
  
  connection_setup.connect();

  var query1 = "CREATE database " + database;
  connection_setup.query(query1, function(err, rows, fields) {
    if (err) {
      console.log("Error creating database: " + err);
      res.send(500);
    }

    res.send(200);
  });

  var query2 = "use " + database;
  connection_setup.query(query2, function(err, rows, fields) {
    if (err) {
      console.log("Error creating database: " + err);
      res.send(500);
    }

    res.send(200);
  });

  var query3 = "create table " + table + " (guid char(36), tolerance double)"
  connection_setup.query(query3, function(err, rows, fields) {
    if (err) {
      console.log("Error creating database: " + err);
      res.send(500);
    }

    res.send(200);
  });

  connection_setup.end();
})
// ----


