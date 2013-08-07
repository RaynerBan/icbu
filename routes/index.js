
/*
 * GET home page.
 */
var crypto = require('crypto');
var User = require('../models/user.js'
);

module.exports = function(app){
	//routes
	app.get('/', function(req, res){
  		res.render('index', { 
  			title: 'ICBU Center',
  			name: 'blog' ,
  			items: [1992, 'liaopr', 'express']
  		});
	});
	app.get('/user/:username', function(req, res){
		res.send("ok");
	});
	app.post('/post', function(req,res){});
	app.get('/register',function(req, res){
		res.render('register',{
			title: '用户注册',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/register',function(req,res){
		//检查两次密码
		if(req.body['password-repeat'] != req.body['password']){
			req.flash('error','两次口令不一致');
			return res.redirect('/register');
		}
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		
		
		var newUser = new User({
			name : req.body.username,
			password : password
		});

		//检查用户存在
		User.get(newUser.name, function(err, user){
			if(user){
				err = '用户名已经存在.';
			}
			if(err){
				req.flash('error',err);
				return res.redirect('/register');
			}
			//用户不存在，添加用户
			newUser.save(function(err){
				if(err){
					req.flash('error', err);
					return res.redirect('/register');
				}
				req.session.user = newUser;
				req.flash('success', '注册成功');
				res.redirect('/');
			});
		});
		

	});
	app.get('/login',function(req,res){});
	app.post('/login',function(req,res){});
	app.get('/logout',function(req,res){});
	app.get('/time', function(req,res){});
	
};


