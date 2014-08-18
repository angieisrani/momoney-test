GLOBAL.database = 'hackday';
GLOBAL.table = 'users';
GLOBAL.field = 'tolerance'; 
GLOBAL.dbhost = "localhost"
GLOBAL.dbuser = "root"

GLOBAL.restify = require('restify');
GLOBAL.mysql = require('mysql');
require('./setup.js');
require('./teardown.js');
require('./functions.js');
