const Joi = require('joi');

const createPayments = {
    body: Joi.object().keys({
        AuthResultCode: Joi.string(),
        AuthResultMsg: Joi.string(),
        AuthToken: Joi.string(),
        PayMethod: Joi.string(),
        MID: Joi.string(),
        Moid: Joi.string(),
        Amt: Joi.string(),
        ReqReserved: Joi.string().allow(null).allow(''),
        TxTid: Joi.string(),
        NextAppURL: Joi.string(),
        NetCancelURL: Joi.string(),
        Signature: Joi.string(),
    }),
};

module.exports = {
    createPayments,
};
