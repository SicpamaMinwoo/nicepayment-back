const { tokenTypes } = require('../config/tokens');

module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define('api_tokens', {
        token: {
            type: Sequelize.STRING,
            required: true,
        },
        userId: {
            type: Sequelize.BIGINT,
            required: true,
        },
        type: {
            type: Sequelize.STRING,
            enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
            required: true,
        },
        expires: {
            type: Sequelize.DATE,
            required: true,
        },
        blacklisted: {
            type: Sequelize.BOOLEAN,
            default: false,
        },
    });

    return Token;
};
