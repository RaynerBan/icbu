
/**
 * Module dependencies.
 */


var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');
//var partials = require('express-partials');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');

var app = express();

app.configure(function(){
      // all environments
      app.set('port', process.env.PORT || 3000);
      app.set('views', __dirname + '/views');
      app.set('view engine', 'ejs');
      //app.set('view options',{layout:true});
      app.use(express.favicon());
      app.use(express.logger('dev'));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      //add cookie & session
      app.use(express.cookieParser());
      app.use(express.session({
      	secret: settings.cookieSecret,
      	store: new MongoStore({
      		db: settings.db
      	})
      }));
      app.use(flash());
      
      app.use(app.router);
      //app.use(express.router(routes));
      app.use(express.static(path.join(__dirname, 'public')));         
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.use(function(req,res,next){
var err = req.flash('error'),
    success = req.flash('success');
res.locals.user = req.session.user;
res.locals.error = err.length ? err : null;
res.locals.success = success.length ? success : null;
next();
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

routes(app);

