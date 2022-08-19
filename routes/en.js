const express = require('express'),
  router = express.Router();

router.get('/', function(req, res) {
  res.render('en/index', {title:"fistmedia"});
});

router.get('/services', function(req, res) {
  const db = req.con;
  let op = ``;
  let i = 0;
  //SELECT * FROM subcats LEFT JOIN services ON subcats.service=services.service
  db.query("SELECT * FROM services", function(err, result) {
    if (err) throw err;
    result.forEach(function(row) {
      op+=`\n<input type="radio" name="service" id="`+i+`" value="`+row.service+`"><label for="`+i+`">`+row.desc_se+`</label><select id="`+i+`sc">`;
      db.query("SELECT subcat, desc_sc, price FROM subcats where service="+row.service, function(err, result) {
        if (err) throw err;
        result.forEach(function(row) {
          op+=`<option value="`+row.subcat+`">`+row.desc_sc+` `+row.price+`RSD</option>`;
        });
        op+=`</select><br/>`;
      });
      i++;
    });
  });
  res.render('sr/services', {title: "Usluge", options: op},{cache: true, filename: 'services'});
});

router.post('/process', function (req, res) {
  console.log("INSERT INTO purchases (service, contact, details, subcat) VALUES ('"+req.body.sql+"');");
  /*req.con.query("INSERT INTO purchases (service, contact, details, subcat) VALUES ('"+req.body.sql+"');", function(err, result) {
    if (err) { res.status(500); return res.end(err.message); }
  });*/
});

router.get('/about', function(req, res) {
  res.render('en/about', {title: "About us"});
});

module.exports = router;
