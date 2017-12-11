var express = require('express');
var router = express.Router();
var spotcrime = require('spotcrime');



router.post('/', function(req, res, next) {

// somewhere near phoenix, az
    var loc = {
        lat: req.body.lat,
        lon: req.body.lon
    };


    var radius = 0.02; // this is miles

    spotcrime.getCrimes(loc, radius, function(err, crimes){
        console.log(crimes)
        // res.json(crimes)
        res.render('index', {crimes: crimes})
    });
});

module.exports = router