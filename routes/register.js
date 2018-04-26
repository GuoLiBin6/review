var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/register', function(req, res) {
	console.log(req.body)
	var userID = req.body.userID;
	var password = req.body.password;
	
	res.send(userID);
	
	console.log(password);
	
	
	
});

module.exports = router;
