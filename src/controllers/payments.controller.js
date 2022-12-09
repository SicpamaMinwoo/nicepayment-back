const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { paymentService } = require('../services');

const createPayments = catchAsync(async (req, res) => {
    const result = await paymentService.createPayments(req.body);
    res.send(result);
});

module.exports = {
    createPayments,
};
