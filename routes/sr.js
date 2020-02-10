const router = require('express').Router(),
	  passport = require('passport');

router.get('/', (req, res) => {
	res.render('sr/index', {title:"fistmedia", user: req.user});
});

router.get('/login',passport.authenticate('facebook'));

router.get('/return',
	passport.authenticate('facebook', { failureRedirect: '/login' }),(req, res) => {
		req.con.query("INSERT INTO users (id, name, surname, email) VALUES ('"+req.user.id+"', '"+req.user.name.givenName+"', '"+req.user.name.familyName+"', '"+req.user.emails[0].value+"') ON DUPLICATE KEY UPDATE email = '"+req.user.emails[0].value+"';",(err, result) => {
			if (err) throw err;
			res.redirect('/');
		});
});

router.post('/cookie', (req,res) => {
	res.cookie(req.body.name, req.body.value,{maxAge: 17280000}).end();
});

router.route('/services')
	.get((req, res) => {
		req.con.query("SELECT * FROM subcats LEFT JOIN services ON subcats.service=services.service", (err,rows) => {
			if (err) throw err;
			//SELECT COUNT(subcat) FROM subcats GROUP BY service
			if (req.query.vmode == "full" || !req.query.vmode && req.cookies["vmode"] == "full")
				res.render('sr/services2', {rows, title: "Usluge", user: req.user});//,{cache: true, filename: 'sr/services2'});
			else
				res.render('sr/services', {rows, title: "Usluge", user: req.user});//,{cache: true, filename: 'sr/services'});
		});
	})
	.post((req, res) => {
		req.con.query("INSERT INTO purchases (contact, details, subcat) VALUES ('"+req.body.contact+"', '"+req.body.details+"', '"+req.body.iisc+"');", (err, result) => {
			if (err) throw err;
		});
	})

router.route('/users')
	.get(require('connect-ensure-login').ensureLoggedIn(),(req, res) => {
		req.con.query('SELECT * FROM users', (err,rows) => {
			if (err) throw err;
			res.render('sr/users',{rows,title: "Korisnici", user: req.user});
		});
	})
	/*.post((req,res) => {
		req.con.query("INSERT INTO users (id, password, email) VALUES ('"+req.body.id+"', '"+req.body.password+"', '"+req.body.email+"');", (err, result) => {
			if (err) throw err;
		});
	});*/
	.post((req,res) => {
		req.con.query("UPDATE users SET type = '"+req.body.type+"' WHERE id='"+req.body.id+"';", (err, result) => {
			if (err) throw err;
		});
	});

router.route('/purchases')
	.get(require('connect-ensure-login').ensureLoggedIn(),(req, res) => {
		req.con.query('SELECT * FROM purchases ORDER BY completed', (err,rows) => {
			if (err) throw err;
			res.render('sr/purchases',{rows,title: "Kupovine", user: req.user});
		});
	})
	.post((req,res) => {
		req.con.query("UPDATE purchases SET completed = '"+req.body.completed+"' WHERE id_p='"+req.body.id_p+"';", (err, result) => {
			if (err) throw err;	
		});
	});

router.get('/about',(req, res) => {
	res.render('sr/about', {title: "O nama", user: req.user});
});

router.get('/jaguar',(req, res) => {
	res.render('jaguar');
});

module.exports = router;
