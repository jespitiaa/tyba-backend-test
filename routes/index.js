var express = require('express');
var router = express.Router();

/* GET health status. */
router.get('/health', function(req, res, next) {
  res.status(200).json({status:'up'});
});

module.exports = router;
