const {Client} = require("@googlemaps/google-maps-services-js");
const transactionsController = require('./transactions');
const client = new Client({});

function getNearbyRestaurants(lat, lng){
    return client.placesNearby({params:{
        location: `${lat}, ${lng}`,
        keyword: 'restaurant',
        radius: 500,
        key: process.env.GOOGLE_MAPS_API_KEY
    }}).then((res)=> {
        transactionsController.createTransaction(username, result.insertedId, 'registration'); //not using await in order to avoid delays on the actual response
        return {results: res.data.results}
    })
    .catch((e)=>{
        throw e
    });
}

module.exports = {
    getNearbyRestaurants
};