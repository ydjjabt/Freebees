//need mongodb model here:
var Item = require('./items/itemModel.js');

module.exports = function(app){
  //server routes
  app.get('/', function(req, res) {
    //use mongoose to get all items in db
  });

  //sample route for testing
  app.get('/test', function(req, res){
    res.send('worked');
  });

  app.post('/', function(req, res){
    //insert item into mongodb
    console.log(req.body);
    res.send(201);
  });

  //any other route will load home page
  app.get('*', function(req, res){
    res.sendFile('./client/index.html');
    //or do we want to redirect to '/'?
  });
};
