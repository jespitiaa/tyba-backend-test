# tyba-backend-test

App created with express js. Uses google Maps API to retrieve places nearby to a location.
The solution uses a cloud DBaaS called AtlasDB that provides access to a MongoDB cluster. Such connection is established through a certificate validation, i.e. a .pem file that will be shared with the trainee.

The code includes some comments that show the reasoning behind the decissions that were made, knowing that some other variables (such as other endpoint interaction) could make the code not be the most optimal solution.

In order to execute the app locally, place `dbcrt-dev.pem` and `.env` files on the root dir, run `npm install`, then run `npm start`.

TODOS/PENDINGS:
- finish setting up the docker configuration
- make the MongoDB instance part of the container and establish a network, instead of using a cloud solution
- implement logout. Intended approach was to have refreshTokens along with the accessTokens that were sent as headers too, and would be required for regenerating tokens. Logging out would then be a matter of un-caching the refreshToken of an user.
- include error test cases in the postman collection
