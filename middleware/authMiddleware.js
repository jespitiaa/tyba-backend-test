let jwt = require( 'jsonwebtoken' );
require('dotenv').config();

// token validation middleware is going to be invoked from app.js
let checkToken = ( req, res, next ) => {
  
  // any of these headers might contain the auth token
  let token = req.headers[ 'x-access-token' ] || req.headers[ 'authorization' ];
  // if no header is present or no value exists, no requests should be permitted (assumption. Not specified in the test)
  if( token ) {

    if ( token.startsWith( 'Bearer ' ) ) {
        token = token.slice(7, token.length );
        // verifying the token validates the secret and also the expiration status
        jwt.verify( token, process.env.JWT_SECRET, ( err, decoded ) => {
        if( err ) {
          console.log(err);
          return res.status(403).json( {
            success: false,
            message: 'Token is not valid'
          } );
        } else {
            // decode jwt info values and make them available for the request 
            req.headers['username'] = decoded.username;
            req.headers['userId'] = decoded.userId;
            next(req,res);
        }
      } );
    }
  } else {
    return res.status(400).json( {
      success: false,
      message: 'Auth token is not supplied'
    } );
  }

};

module.exports = {
  checkToken: checkToken
};