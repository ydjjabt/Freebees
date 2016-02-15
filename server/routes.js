//need mongodb model here:
var ItemFuncs = require('./items/itemController.js');

module.exports = function(app){
  //server routes
  app.get('/api/items', ItemFuncs.getAllItems);

  //sample route for testing
  app.get('/test', function(req, res){
    res.send('worked');
  });

  app.post('/', ItemFuncs.saveItem);

  //any other route will load home page
  app.get('*', function(req, res){
    res.redirect('/');
    //or do we want to redirect to '/'?
  });
};
