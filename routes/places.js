var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
var mapsController = require("../controllers/maps");

router.get('/nearbyRestaurants', (req, res, next) => authMiddleware.checkToken(req, res, function(){
    let {lat, lng} = req.query;
    mapsController.getNearbyRestaurants(lat, lng)
        .then((restaurants)=>{
            res.send(restaurants);
        })
        .catch((error)=>{
            res.status(500).send(`could not get restaurants ${error}`);
        });
}));

module.exports = router;