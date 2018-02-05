var express = require('express');
var app = express();
var path = require('path');
var parseurl = require('parse-url');
var bodyparser = require('body-parser');


app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')))
app.get('/',function (req,res) {
    res.sendFile(path.join(__dirname,'views/index.html'));
});

app.post('/',function (req,res) {
});

app.get('/:id',function (req,res) {

});

app.listen(process.env.PORT || 3000);

