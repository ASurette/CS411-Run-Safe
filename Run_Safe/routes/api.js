var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/RunSafe');
var db = mongoose.connection;
var Schema = mongoose.Schema;
var personSchema = new Schema ({
    username: String,
    city: String,
    age: Number,
    height: String,
    weight: Number
});
var Users = mongoose.model('Users', personSchema);

var routeSchema = new Schema ({
    routename: String,
    startpoint: String,
    distance: Number,
    link: String
})

var Routes = mongoose.model('Routes', routeSchema);

// POST Create a new user
router.post('/db', function(req, res, next) {
  aPerson = new Users(
      req.body
  );
  aPerson.save(function(err) {
    if (err) {res.send(err);}
        //send back the new person
    else {res.send (aPerson)}
  })
});


// POST Create a new route
router.post('/db', function(req, res, next) {
    aRoute = new Routes(
        req.body
    );
    aRoute.save(function(err) {
        if (err) {res.send(err);}
        //send back the new person
        else {res.send (aRoute)}
    })
});

//GET Fetch all users
router.get('/db', function (req, res, next) {
  Users.find({}, function (err, results) {
    res.json(results);
  })

});


//GET Fetch single user, match /users/db/Frank
router.get('/db/:_id', function (req, res, next) {
  Users.find({_id: req.param('_id')}, function (err, results) {
    res.json(results);
  });
});

//GET Fetch all routes
router.get('/db', function (req, res, next) {
    Routes.find({}, function (err, results) {
        res.json(results);
    })

});

//GET Fetch single route
router.get('/db/:_id', function (req, res, next) {
    Routes.find({_id: req.param('_id')}, function (err, results) {
        res.json(results);
    });
});


//PUT Update the specified user's name
router.put('/db/:_id', function (req, res, next) {
  Users.findByIdAndUpdate(req.params._id, req.body, {'upsert': 'true'}, function (err, result) {
    if (err) {res.json({message: 'Error updating'});}
    else {console.log('updated'); res.json({message: 'success'})};
  })

});


//PUT Update the specified route's name
router.put('/db/:_id', function (req, res, next) {
    Routes.findByIdAndUpdate(req.params._id, req.body, {'upsert': 'true'}, function (err, result) {
        if (err) {res.json({message: 'Error updating'});}
        else {console.log('updated'); res.json({message: 'success'})};
    })

});


//DELETE Delete the specified user
router.delete('/db/:_id', function (req, res, next) {
  Users.findByIdAndRemove(req.params._id, function (err, result) {
    if(err) {res.json({message: 'Error deleting'});}
    else {res.json({message: 'success'});}
  })
});

//DELETE Delete the specified route
router.delete('/db/:_id', function (req, res, next) {
    Routes.findByIdAndRemove(req.params._id, function (err, result) {
        if(err) {res.json({message: 'Error deleting'});}
        else {res.json({message: 'success'});}
    })
});

module.exports = router;
