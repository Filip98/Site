const router = require('express').Router(),
	  passport = require('passport');

router.get('/', function(req, res) {
	res.render('sr/index', {title:"fistmedia", user: req.user});
});

router.get('/login',passport.authenticate('facebook'));

router.get('/return',
	passport.authenticate('facebook', { failureRedirect: '/login' }),function(req, res) {
		req.con.query("INSERT INTO users (username, name, surname, email) VALUES ('"+req.user.id+"', '"+req.user.name.givenName+"', '"+req.user.name.familyName+"', '"+req.user.emails[0].value+"') ON DUPLICATE KEY UPDATE email = '"+req.user.emails[0].value+"';", function(err, result) {
			if (err) throw err;
			res.redirect('/');
		});
});

router.post('/cookie', function(req,res){
	res.cookie(req.body.name, req.body.value,{maxAge: 17280000}).end();
});

router.route('/services')
	.get(function(req, res) {
		req.con.query("SELECT * FROM subcats LEFT JOIN services ON subcats.service=services.service", function(err,rows){ //GROUP BY service
			if (err) throw err;
			if (req.query.vmode == "full" || !req.query.vmode && req.cookies["vmode"] == "full")
				res.render('sr/services2', {rows, title: "Usluge", user: req.user});//,{cache: true, filename: 'sr/services2'});
			else
				res.render('sr/services', {rows, title: "Usluge", user: req.user});//,{cache: true, filename: 'sr/services'});
		});
	})
	.post(function(req, res) {
		req.con.query("INSERT INTO purchases (contact, details, subcat) VALUES ('"+req.body.contact+"', '"+req.body.details+"', '"+req.body.isc+"');", function(err, result) {
			if (err) throw err;
		});
	})

router.route('/users')
	.get(require('connect-ensure-login').ensureLoggedIn(),function(req, res) {
		req.con.query('SELECT * FROM users', function(err,rows){
			if (err) throw err;
			res.render('sr/users',{rows,title: "Korisnici", user: req.user});
		});
	})
	/*.post(function(req,res){
		req.con.query("INSERT INTO users (username, password, email) VALUES ('"+req.body.username+"', '"+req.body.password+"', '"+req.body.email+"');", function(err, result) {
			if (err) throw err;
		});
	});*/
	.post(function(req,res){
		req.con.query("UPDATE users SET type = '"+req.body.type+"' WHERE username='"+req.body.username+"';", function(err, result) {
			if (err) throw err;
		});
	});

router.route('/purchases')
	.get(require('connect-ensure-login').ensureLoggedIn(),function(req, res) {
		req.con.query('SELECT * FROM purchases ORDER BY completed', function(err,rows){
			if (err) throw err;
			res.render('sr/purchases',{rows,title: "Kupovine", user: req.user});
		});
	})
	.post(function(req,res){
		req.con.query("UPDATE purchases SET completed = '"+req.body.completed+"' WHERE id_p='"+req.body.id_p+"';", function(err, result) {
			if (err) throw err;	
			res.render('sr/purchases',{rows,title: "Kupovine", user: req.user});
		});
	});

router.get('/about', function(req, res) {
	res.render('sr/about', {title: "O nama", user: req.user});
});

router.get('/jaguar', function(req, res) {
	res.render('jaguar');
});

module.exports = router;
