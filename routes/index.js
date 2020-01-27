const router = require('express').Router(),
	  passport = require('passport');

/* GET home page. */
router.get('/', function(req, res) {
	res.redirect('sr');
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

router.get('/jaguar', function(req, res) {
	res.render('jaguar');
});

module.exports = router;
