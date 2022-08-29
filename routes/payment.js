var express = require('express');
var router = express.Router();
const iconv = require('iconv-lite')
const request = require('request')
const CryptoJS = require("crypto-js")
const format = require('date-format');

function SHA256(s) {

    var chrsz = 8;
    var hexcase = 0;

    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    function S(X, n) {
        return (X >>> n) | (X << (32 - n));
    }

    function R(X, n) {
        return (X >>> n);
    }

    function Ch(x, y, z) {
        return ((x & y) ^ ((~x) & z));
    }

    function Maj(x, y, z) {
        return ((x & y) ^ (x & z) ^ (y & z));
    }

    function Sigma0256(x) {
        return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
    }

    function Sigma1256(x) {
        return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
    }

    function Gamma0256(x) {
        return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
    }

    function Gamma1256(x) {
        return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
    }

    function core_sha256(m, l) {

        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
            0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
            0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
            0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
            0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147,
            0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
            0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B,
            0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
            0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
            0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
            0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);

        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB,
            0x5BE0CD19);

        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;

        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;

        for (var i = 0; i < m.length; i += 16) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];

            for (var j = 0; j < 64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j -
                16]);

                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));

                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }

            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }

    function str2binb(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
        }
        return bin;
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    }

    function binb2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
        }
        return str;
    }

    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

}

router.get('/', function(req, res, next) {
    const today = new Date();
    const mid = 'nickakao1m';
    const merchantKey = 'A2SY4ztPs6LPymgFl/5bbsLuINyvgKq5eOdDSHb31gdO4dfGr3O6hBxvRp9oXdat45VninNUySc7E/5UT01vKw==';
    
    res.render('payment', {
        goodsName: '테스트제품',
        amt: 1000,
        merchantID: mid,
        moid: 'mnoid1234567890',
        buyerName: 'Minwoo Lee',
        buyerEmail: 'test@example.com',
        buyerTel: '01011112222',
        returnURL: 'http://localhost:4000/payment/authReq',
        ediDate: today.toString("yyyyMMddHHiiss"),
        signData: getSignData(`${today.toString("yyyyMMddHHiiss")}${mid}${1000}${merchantKey}`).toString(),
    });
})

//authentication from client
router.post('/authReq', function(req, res) {

    const merchantKey = 'A2SY4ztPs6LPymgFl/5bbsLuINyvgKq5eOdDSHb31gdO4dfGr3O6hBxvRp9oXdat45VninNUySc7E/5UT01vKw==';
    var ediDate = format.asString('yyyyMMddhhmmss', new Date());
    var authResultCode = req.body.AuthResultCode;
    var authResultMsg = req.body.AuthResultMsg;
    var txTid = req.body.TxTid;
    var authToken = req.body.AuthToken;
    var payMethod = req.body.PayMethod;
    var mid = req.body.MID;
    var moid = req.body.Moid;
    var amt = req.body.Amt;
    var reqReserved = req.body.ReqReserved;
    var nextAppURL = req.body.NextAppURL; //승인 API URL
    var netCancelURL = req.body.NetCancelURL;  //API 응답이 없는 경우 망취소 API 호출
    //var authSignature = req.body.Signature; //Nicepay에서 내려준 응답값의 무결성 검증 Data
	//인증 응답 Signature = hex(sha256(AuthToken + MID + Amt + MerchantKey)
    //var authComparisonSignature = getSignData(req.body.AuthToken + req.body.MID + req.body.Amt + merchantKey).toString();
    var signData = getSignData(authToken + mid + amt + ediDate + merchantKey).toString();
	
	/*  
	****************************************************************************************
	* Signature : 요청 데이터에 대한 무결성 검증을 위해 전달하는 파라미터로 허위 결제 요청 등 결제 및 보안 관련 이슈가 발생할 만한 요소를 방지하기 위해 연동 시 사용하시기 바라며 
	* 위변조 검증 미사용으로 인해 발생하는 이슈는 당사의 책임이 없음 참고하시기 바랍니다.
	****************************************************************************************
	*/

    // Configure the request
    var options = {
        url: nextAppURL,
        method: 'POST',
        headers: {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        encoding: null,
        form: { 'TID': txTid, 
                'AuthToken': authToken, 
                'Amt': amt, 
                'MID': mid,
                'SignData': signData,
                'EdiDate': ediDate,
        }
    }
    
	//인증 응답으로 받은 Signature 검증을 통해 무결성 검증을 진행하여야 합니다.
	/*if(authSignature === authComparisonSignature){
		authRequest(options); //authResultCode가 0000인 경우만 승인 API 호출 합니다.
	}
	else{
		console.log("authSignature : " + authSignature)
		console.log("authComparisonSignature : " + authComparisonSignature)
	}*/
	authRequest(options); //authResultCode가 0000인 경우만 승인 API 호출 합니다.
    res.send('Result data is in Terminal');
})

function authRequest(options){
    // Start the request
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var strContents = new Buffer(body)
            var returnObj = JSON.parse(iconv.decode(strContents, 'EUC-KR').toString())
			//var Signature = JSON.parse(strContents).Signature.toString()
			console.log(returnObj)
			//가맹점은 승인응답으로 전달된 TID, Amt 값을 활용하여 위변조 대조 해쉬값을 생성하여 전달받은 Signature 값과 대조를 진행합니다. 대조가 일치할 경우 정상승인을 진행합니다.
			/*if (options.url === "https://webapi.nicepay.co.kr/webapi/pay_process.jsp"){
				var paySignature = getSignData(JSON.parse(strContents).TID.toString() + JSON.parse(strContents).MID.toString() + JSON.parse(strContents).Amt.toString() + merchantKey).toString();
				console.log(returnObj)
				if (Signature === paySignature) {
					console.log("Signature : " + Signature)
				}
				else {
					console.log("Signature : " + Signature)
					console.log("paySignature : " + paySignature)
				}
			}
			else { //취소 응답 시 위변조 대조 해쉬값을 생성하여 전달받은 Signature 값과 대조를 진행합니다. 대조가 일치할 경우 취소를 진행합니다.
				var cancelSignature = getSignData(JSON.parse(strContents).TID.toString() + JSON.parse(strContents).MID.toString() + JSON.parse(strContents).CancelAmt.toString() + merchantKey).toString();
				console.log(returnObj)
				if (Signature === cancelSignature) {
					console.log("Signature : " + Signature)
				}
				else {
					console.log("Signature : " + Signature)
					console.log("cancelSignature : " + cancelSignature)
				}
			}*/
        }
    })
}

function getSignData(str) {
    var encrypted = CryptoJS.SHA256(str);
    return encrypted;
}

module.exports = router;