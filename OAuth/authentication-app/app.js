/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var basicAuth = require('basic-auth');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// serve the files out of ./public as our main files
//app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// User registry.
var registry = '{ "users" : [' +
   '{ "name":"foo", "pass":"bar"}, ' +
   '{ "name":"nameA", "pass":"passA"} ]}';

var registryObj = JSON.parse(registry);

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

// Test to see if credentials are in the user registry
var lookup = function(name, pass) {
  for (var user of registryObj.users) {
    if ((name == user.name) && (pass == user.pass)) {
      return true;
    }
  }
  return false;
}
var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);

  if (!user) {
    return unauthorized(res);
  };

//  if (user.name === 'foo' && user.pass === 'bar') {
  if (lookup(user.name, user.pass)) {
    return next();
  } else {
    return unauthorized(res);
  };
};

app.get('/authenticate', auth, function(request, response) {
	response.sendStatus(200);
	response.end();
	return;
});
