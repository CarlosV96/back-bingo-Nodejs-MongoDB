const express = require('express');
const router = express.Router();

/**
 * Ruta Users.
 */
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signup');
});

module.exports = router;
