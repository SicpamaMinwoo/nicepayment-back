var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const base64url = require('base64url');

const randomBase64URLBuffer = (length) => {
    length = length || 32;

    const buffer = crypto.randomBytes(length);

    return base64url(buffer);
}

router.get('/', function(req, res, next) {
    res.render('register', {});
})
  
router.post('/', function(req, res, next) {
    const challenge = randomBase64URLBuffer(32);

    res.send({
      challenge: challenge,
      rp: {
        name: 'FIDO Example'
      },
      user: {
        id: 1,//new Uint8Array(16),
        name: req.body.name,
        displayName: req.body.username
      },
      attestation: 'direct',
      authenticatorSelection: {
        authenticatorAttachment: "platform",
      },
      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -7
        }
      ]
    })
});
  
module.exports = router;
