const express = require('express');
const router = express.Router();

/**
 * Ruta index.
 */
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login' });
});

module.exports = router;
