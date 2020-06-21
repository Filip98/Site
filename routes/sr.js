const router = require("express").Router(),
	  connect = require("connect-ensure-login"),
	  //bcryptjs = require("byryptjs"),
	  passport = require("passport");

router.get("/", (req, res) => {
	res.render("sr/index", {title: "fistmedia", user: req.user});
});

router.get("/login", passport.authenticate("facebook"));

router.get("/return",
	passport.authenticate("facebook", {failureRedirect: "/login"}), async (req, res) => {
		let conn;

		try {
			conn = await req.pool.getConnection();

			const result = await conn.query(
				"INSERT INTO users (username, name, surname, email) VALUES ('?', '?', '?', '?') ON DUPLICATE KEY UPDATE email = '?';",
				[req.user.id, req.user.name.givenName, req.user.name.familyName, req.user.emails[0].value, req.user.emails[0].value]
			);
			res.redirect("/");
		} catch (err) {
			throw err;
		} finally {
			if (conn) return conn.end();
		}
	}
);

router.post("/cookie/:name/:value/:maxAge", (req,res) => {
	res.cookie(req.params.name, req.params.value, {maxAge: req.params.maxAge}).end();
});

router.route("/services")
	.get(async (req, res) => {
		let conn;

		try {
			conn = await req.pool.getConnection();

			const rows = await conn.query("SELECT * FROM subcats LEFT JOIN services USING(service) ORDER BY subcats.service;");
			const num = await conn.query("SELECT COUNT(*) as br FROM subcats GROUP BY service;");
			
			if (req.query.vmode == "full" || !req.query.vmode && req.cookies["vmode"] == "full")
				res.render("sr/services2", {rows, num, title: "Usluge", user: req.user});//,{cache: true, filename: 'sr/services2'});
			else
				res.render("sr/services", {rows, num, title: "Usluge", user: req.user});//,{cache: true, filename: 'sr/services'});
		} catch (err) {
			throw err;
		} finally {
			if (conn) return conn.end();
		}
	})
	.post(async (req, res) => {
		let conn;

		try {
			conn = await req.pool.getConnection();

			const rows = await conn.query(
				"INSERT INTO purchases (contact, details, subcat) VALUES ('?', '?', '?');", 
				[req.body.contact, req.body.details, req.body.iisc]
			);
			const num = await conn.query("SELECT COUNT(*) as br FROM subcats GROUP BY service;");
			
			if (req.query.vmode == "full" || !req.query.vmode && req.cookies["vmode"] == "full")
				res.render("sr/services2", {rows, num, title: "Usluge", user: req.user});//,{cache: true, filename: 'sr/services2'});
			else
				res.render("sr/services", {rows, num, title: "Usluge", user: req.user});//,{cache: true, filename: 'sr/services'});
		} catch (err) {
			throw err;
		} finally {
			if (conn) return conn.end();
		}
	})

router.route("/users")
	.get(connect.ensureLoggedIn(), async (req, res) => {
		let conn;

		try {
			conn = await req.pool.getConnection();

			const rows = await conn.query("SELECT * FROM users;");
			res.render("sr/users", {rows,title: "Korisnici", user: req.user});
		} catch (err) {
			throw err;
		} finally {
			if (conn) return conn.end();
		}
	})
	/*.post((req,res) => {
		req.con.query("INSERT INTO users (id, password, email) VALUES ('"+req.body.id+"', '"+req.body.password+"', '"+req.body.email+"');", (err, result) => {
			if (err) throw err;
		});
	});*/
	.post(async (req,res) => {
		let conn;

		try {
			conn = await req.pool.getConnection();

			const res = await conn.query(
				"UPDATE users SET type = '?' WHERE id='?';",
				[req.body.type, req.body.id]
			);
		} catch (err) {
			throw err;
		} finally {
			if (conn) return conn.end();
		}
	});

router.route("/purchases")
	.get(connect.ensureLoggedIn(), async (req, res) => {
		let conn;

		try {
			conn = await req.pool.getConnection();

			const rows = conn.query("SELECT * FROM purchases ORDER BY completed;");
			res.render("sr/purchases", {rows,title: "Kupovine", user: req.user});
		} catch (err) {
			throw err;
		} finally {
			if (conn) return conn.end();
		}
	})
	.post(async (req,res) => {
		let conn;

		try {
			conn = await req.pool.getConnection();

			const result = conn.query(
				"UPDATE purchases SET completed='?' WHERE id_p='?';",
				[req.body.completed, req.body.id_p]
			);
		} catch (err) {
			throw err;
		} finally {
			if (conn) return conn.end();
		}
	});

router.get("/about", (req, res) => {
	res.render("sr/about", {title: "O nama", user: req.user});
});

router.get("/jaguar", (req, res) => {
	res.render("sr/jaguar");
});

module.exports = router;
