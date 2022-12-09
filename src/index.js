const db = require('../models');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;

db.sequelize
    .authenticate()
    .then(() => {
        logger.info('Connected to MYSQL');

        server = app.listen(config.port, () => {
            logger.info(`Listening to port ${config.port}`);
        });
    })
    .catch((err) => {
        logger.info(`Unable to connect to the database: ${err}`);
    });

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
