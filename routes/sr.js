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
      conn = req.pool.db();

      await conn.collection("users").updateOne(
        {"connections.facebook": req.user.id},
        {
          "active": new Date(),
          $setOnInsert: {
            "connections": [
              {"facebook": req.user.id}
            ],
            "name": req.user.name.givenName,
            "email": req.user.emails[0].value,
            "password": "",
            "type": 0,
            "created_at": new Date()
          }
        },
        {upsert: true}
      );

      res.redirect("/");
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.close();
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
      conn = req.pool.db();

      let rows = conn.collection("services").find({}).toArray();
      let num = conn.collection("services").aggregate([
        {$project: {_id: 0, br: {$size: "$subcat"}}}
      ]).toArray();

      rows = await rows;
      num = await num;
      const params = {rows, num, title: "Usluge", user: req.user};
      console.log(params);
      if (req.query.vmode == "full" || !req.query.vmode && req.cookies["vmode"] == "full")
        res.render("sr/services2", params);
      else
        res.render("sr/services", params);
    } catch (err) {
      throw err;
    }
  })
  .post((req, res) => {
    let conn;

    try {
      conn = req.pool.getConnection();

      const rows = conn.query(
        "INSERT INTO purchases (contact, details, subcat) VALUES ('?', '?', '?');", 
        [req.body.contact, req.body.details, req.body.iisc]
      );
      const num = conn.query("SELECT COUNT(*) as br FROM subcats GROUP BY service;");
      
      if (req.query.vmode == "full" || !req.query.vmode && req.cookies["vmode"] == "full")
        res.render("sr/services2", {rows, num, title: "Usluge", user: req.user});
      else
        res.render("sr/services", {rows, num, title: "Usluge", user: req.user});
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.close();
    }
  })

router.route("/users", connect.ensureLoggedIn())
  .get(async (req, res) => {
    let conn;

    try {
      conn = req.pool.db();

      const rows = await conn.collection("users").find({});
      res.render("sr/users", {rows, title: "Korisnici", user: req.user});
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.close();
    }
  })
  /*.post((req,res) => {
    req.con.query("INSERT INTO users (id, password, email) VALUES ('"+req.body.id+"', '"+req.body.password+"', '"+req.body.email+"');", (err, result) => {
      if (err) throw err;
    });
  });*/
  .post(async (req,res) => {
    try {
      await req.pool.users.updateOne(
        {_id: req.body.id},
        {type: req.body.type}
      );
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.close();
    }
  });

router.route("/purchases")
  .get(connect.ensureLoggedIn(), (req, res) => {
    let conn;

    try {
      conn = req.pool.getConnection();

      const rows = conn.query("SELECT * FROM purchases ORDER BY completed;");
      res.render("sr/purchases", {rows,title: "Kupovine", user: req.user});
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.close();
    }
  })
  .post((req, res) => {
    let conn;

    try {
      conn = req.pool.getConnection();

      const result = conn.query(
        "UPDATE purchases SET completed='?' WHERE id_p='?';",
        [req.body.completed, req.body.id_p]
      );
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.close();
    }
  });

router.get("/about", (req, res) => {
  res.render("sr/about", {title: "O nama", user: req.user});
});

module.exports = router;
