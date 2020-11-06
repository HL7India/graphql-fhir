const { SERVER_CONFIG, DB_USER } = require('./config.js');
const FHIRServer = require('./lib/server.js');

const {cluster, dbname, username, password} = DB_USER

// load environment settings
require('./environment.js');

// Start buliding our server
let server = new FHIRServer(SERVER_CONFIG)
	// .initializeDatabaseConnection()          HL7India - use MongoDb below
	.configureMiddleware()
	.configurePassport()
	.configureHelmet()
	.enableHealthCheck()
	.setProfileRoutes()
	.setErrorRoutes();

// Mongodb connection initialization

    server.initializeDatabaseConnection({
    url: `mongodb+srv://${username}:${password}@${cluster}/${dbname}?retryWrites=true&w=majority`,
    db_name: dbname,
    mongo_options: { auto_reconnect: true, useUnifiedTopology: true }
}).then(() => {
    server.listen(SERVER_CONFIG.port);
    server.logger.info('FHIR Server listening on localhost:' + SERVER_CONFIG.port);
}).catch(err => {
    server.logger.error('Fatal Error connecting to Mongo.', err);
});
