var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const base64url = require('base64url');

router.post('/print', (req, res) => {
  res.json({ status: "success" });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
