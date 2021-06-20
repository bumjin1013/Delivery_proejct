var express = require('express'),
    http = require('http'),
    path = require('path');

var bodyParser = require('body-parser'),
    static = require('serve-static'),
    expressErrorHandler = require('express-error-handler'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    expressLayouts = require('express-ejs-layouts');


var mongoClient = require('mongodb').MongoClient,
    mongodb = require('mongodb'),
    mongoose = require('mongoose');
    

var config = require('./config'),
    route_loader = require('./routes/route_loader'),
    database = require('./database/database');


var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(expressLayouts);

app.set('port', process.env.port || config.server_port);



app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

route_loader.init(app, express.Router());

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);



var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

	// 데이터베이스 초기화
	database.init(app, config);
   
});



