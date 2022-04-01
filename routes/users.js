var express = require('express');
var router = express.Router();
var authController = require("../controllers/auth");
var transactionsController = require("../controllers/transactions");

//unclear if this method should be used by an admin to read the transactions of anyone, or if it should be used by the user to read their own.
//assuming #1
router.get('/transactions/:username', (req, res, next) =>{
  //this method should use a different middleware to authorize the requester. May be useful to implement HMAC here in order to 
  //limit this method only to other authorized endpoints that share the HMAC secret.
  //for now, it will not be considered.
  let {username} = req.params;
  transactionsController.readTransactions(username)
    .then((transactions)=>{
      res.status(200).json({transactions});    
    })
    .catch((e)=>{
      res.status(e.status).json({
        success: false,
        message: e.msg
      })
    });
});

router.post('/login', (req, res, next) =>{
  //password should already be encrypted on transport, although, for this test, it will be sent in plain text
  let {username, password} = req.body;
  authController.login(username, password)
    .then((resp) => res.json({
      token: resp
    }))
    .catch((e) => res.status(e.status).json({
      success: false,
      message: e.msg
    }));
});

router.post('/signup', (req, res, next) =>{
  //password should already be encrypted on transport, although, for this test, it will be sent in plain text
  let {username, password, email} = req.body;
  authController.signUp(username, password, email)
    .then((resp) => {
      res.json({
        token: resp
      })
    })
    .catch((e)=>{
      res.status(e.status).json({
        success: false,
        message: e.msg
      })
    });
});

module.exports = router;
