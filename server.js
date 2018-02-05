var express = require('express');
var app = express();
var path = require('path');
var parseurl = require('parse-url');
var bodyParser = require('body-parser');
var redis = require('redis').createClient();
var shortid = require('shortid');
var validUrl = require('valid-url');


var urlencodedParser = bodyParser.urlencoded({extended: false})

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/', urlencodedParser, function (req, res) {
    var id = shortid.generate();
    var input = req.body.input_url

    var fullUrl = "";
    var isurl = "";
    if (validUrl.isUri(input)) {
        redis.set(id, input);
        redis.set(input, id);
        fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + id;
        isurl = true;
    } else {
        fullUrl = "Please Enter a Valid Url";
        isurl = false;
    }

    res.render('index', {red_url: fullUrl, isurl: isurl});


});

app.get('/:id', function (req, res) {
    redis.get(req.params.id, function (err, result) {
        if (err || result === null) {
            res.sendFile(path.join(__dirname, 'views/404.html'));
        } else {
            res.redirect(result);
        }
    });
});

app.listen(process.env.PORT || 3000);

