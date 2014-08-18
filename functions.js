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
