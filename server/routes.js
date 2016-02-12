//need mongodb model here:
var ItemFuncs = require('./items/itemController.js');

module.exports = function(app){
  //server routes
  app.get('/api/items', ItemFuncs.getAllItems);

  //sample route for testing
  app.get('/test', function(req, res){
    res.send('worked');
  });

  app.post('/', function(req, res){
    //insert item into mongodb
    console.log("request body was ", req.body);
    ItemFuncs.saveItem(req.body);
    res.sendStatus(201);
  });

  //any other route will load home page
  app.get('*', function(req, res){
    res.sendFile('./client/index.html');
    //or do we want to redirect to '/'?
  });
};
