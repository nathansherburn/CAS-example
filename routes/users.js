var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', passport.authenticate('local'), function(req, res) {
  res.send('respond with a resource: ' + JSON.stringify(req.params));
});

module.exports = router;
