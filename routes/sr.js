const router = require('express').Router();

router.get('/', function(req, res) {
	res.render('sr/index', {title:"fistmedia", user: req.user});
});

router.route('/services')
	.get(function(req, res) {
		req.con.query("SELECT * FROM subcats LEFT JOIN services ON subcats.service=services.service", function(err,rows){
			if (err) throw err;
			if (req.query.vmode == "full" || !req.query.vmode && req.cookies["vmode"] == "full")
				res.render('sr/services2', {rows, title: "Usluge", user: req.user});//,{cache: true, filename: 'sr/services2'});
			else
				res.render('sr/services', {rows, title: "Usluge", user: req.user});//,{cache: true, filename: 'sr/services'});
		});
	})
	.post(function(req, res) {
		req.con.query("INSERT INTO purchases (service, contact, details, subcat) VALUES ('"+req.body.service+"', '"+req.body.contact+"', '"+req.body.details+"', '"+req.body.isc+"');", function(err, result) {
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
		req.con.query('SELECT * FROM purchases GROUP BY completed', function(err,rows){
			if (err) throw err;
			res.render('sr/purchases',{rows,title: "Kupovine", user: req.user});
		});
	})
	.post(function(req,res){
		req.con.query("UPDATE purchases SET completed = '"+req.body.completed+"' WHERE id_p='"+req.body.id_p+"';", function(err, result) {
			if (err) throw err;	
		});
	});

router.get('/about', function(req, res) {
	res.render('sr/about', {title: "O nama", user: req.user});
});

module.exports = router;
