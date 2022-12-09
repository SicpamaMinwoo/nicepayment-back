const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const paymentValidation = require('../../validations/payments.validation');
const paymentController = require('../../controllers/payments.controller');

const router = express.Router();

router.route('/').post(validate(paymentValidation.createPayments), paymentController.createPayments);

module.exports = router;
