var mysql = require('mysql');
var database = 'hackday';
var table = 'users';
var field = 'tolerance'; 
var dbhost = "localhost"
var dbuser = "root"

var restify = require('restify');

// ---- database setup ----
var connection = mysql.createConnection({
    host: dbhost,
    user: dbuser,
    database: database
  });

function connect() {
  connection.end();
  connection = mysql.createConnection({
    host: dbhost,
    user: dbuser,
    database: database
  });
  
  connection.connect();
}
// --------


// ---- server setup ----
var server = restify.createServer({ name: 'momoney-test' })
 
server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url)
})

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())
// -------- 


// ---- user gets ----
server.get('/users', function (req, res, next) {
  connect();
  var query = "SELECT guid from " + table;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log("Error querying database: " + err);
      res.send(500);
    }

    res.send(200, rows);
  });
})

server.get('/' + field + '/:guid', function (req, res, next) {
  connect();

  var query = "SELECT " + field + " from " + table + " where guid like \"" + req.params.guid + "\"";
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log("Error querying database: " + err);
      res.send(500);
    }

    console.log('Query for: ', req.params.guid , ', returned: ', rows[0][field]);
    // sending the first hit (but there should theoretically only be one)
    res.send(200, rows[0][field]);
  });
})
// --------


// ---- user edits ----
server.post('/user', function (req, res, next) {
  connect();
  console.log(req.params);
  if (req.params.guid === undefined) {
    return next(new restify.InvalidArgumentError('GUID must be supplied'))
  }
 
  var query = "INSERT into " + table + " (guid, " + field + ") VALUES('" + req.params.guid + "', " + req.params[field] + ")";
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log("Error querying database: " + err);
      res.send(500);
    }

    console.log('Created row for: ', req.params.guid);
    res.send(201);
  });
})

server.put('/user/:guid', function (req, res, next) {
  connect();
  console.log(req.params);
  if (req.params[field] === undefined) {
    return next(new restify.InvalidArgumentError(field + ' must be supplied'))
  }

  var query = "UPDATE " + table + " set " + field + "=" + req.params[field] + " where guid like \"" + req.params.guid + "\"";
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log("Error querying database: " + err);
      res.send(500);
    }

    console.log('Updated row for: ', req.params.guid);
    res.send(200);
  });
})

server.del('/user/:guid', function (req, res, next) {
  connect();
  var query = "DELETE from " + table + " where guid like \"" + req.params.guid + "\"";
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log("Error querying database: " + err);
      res.send(500);
    }

    console.log('Deleted row for: ', req.params.guid);
    res.send(200);
  });
})

// ----


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


// ---- teardown ----
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
// --------
