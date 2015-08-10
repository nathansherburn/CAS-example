var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:ticket', function(req, res) {
  res.send('respond with a resource' + req.params);
});

module.exports = router;
