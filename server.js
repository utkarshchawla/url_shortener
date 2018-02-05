var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var path = require('path');
var parseurl = require('parse-url');
var bodyParser = require('body-parser');
var redis = require('redis').createClient(13983, 'redis-13983.c8.us-east-1-2.ec2.cloud.redislabs.com', {no_ready_check: true});
redis.auth('urlshorten', function (err) {
    if (err) throw err;
});

redis.on('connect', function () {
    console.log('Connected to Redis');
});
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
        redis.set(id, input, 'EX', parseInt((+new Date) / 1000) + 86400);
        redis.set(input, id, 'EX', parseInt((+new Date) / 1000) + 86400);

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

app.listen(port);

