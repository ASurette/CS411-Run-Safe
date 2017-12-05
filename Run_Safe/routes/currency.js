var express = require('express');
var router = express.Router();

router.get('/money', function (req, res, next) {
    var request = require("request");

    var options = { method: 'POST',
        url: 'http://apilayer.net/api/live',
        qs:
        { access_key: '707d4d2111a1976c7c4bbd767a9bf3a6',
            source: 'USD',
            currencies: 'EUR',
            format: '1' },
        headers:
        { 'content-type': 'application/x-www-form-urlencoded',
            'postman-token': '03668367-a131-cd34-90b0-84146066742a',
            'cache-control': 'no-cache' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.send(body);

        console.log(body);
    });

});

module.exports = router;