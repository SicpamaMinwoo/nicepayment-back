const { Payments } = require('../../models');
const axios = require('axios');

const CryptoJS = require('crypto-js');

const getFormatDate = (date) => {
    const year = date.getFullYear();
    const month = Number(1 + date.getMonth()) >= 10 ? 1 + date.getMonth() : `0${String(1 + date.getMonth())}`;
    const day = Number(date.getDate()) >= 10 ? date.getDate() : `0${String(date.getDate())}`;
    const hour = Number(date.getHours()) >= 10 ? date.getHours() : `0${String(date.getHours())}`;
    const minute = Number(date.getMinutes()) >= 10 ? date.getMinutes() : `0${String(date.getMinutes())}`;
    const second = Number(date.getSeconds()) >= 10 ? date.getSeconds() : `0${String(date.getSeconds())}`;
    return `${year}${month}${day}${hour}${minute}${second}`;
};

const getSignData = (str) => {
    const encrypted = CryptoJS.SHA256(str);
    return encrypted;
};

/**
 * 
 * @param {*} resultData
 * @returns 
 */
const createPayments = async (resultData) => {
    console.log(resultData);

    const URL = '/webapi/pay_process.jsp';

    const createdDate = getFormatDate(new Date());
    const key = 'b+zhZ4yOZ7FsH8pm5lhDfHZEb79tIwnjsdA0FBXh86yLc6BJeFVrZFXhAoJ3gEWgrWwN+lJMV0W4hvDdbe4Sjw==';

    const options = {
        baseURL: 'https://webapi.nicepay.co.kr',
        url: URL,
        method: 'post',
        headers: {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
            TID: resultData.TxTid,
            AuthToken: resultData.AuthToken,
            MID: resultData.MID,
            Amt: resultData.Amt,
            EdiDate: createdDate,
            SignData: getSignData(resultData.AuthToken + resultData.MID + resultData.Amt + createdDate + key).toString(),
            // SignData: resultData.Signature,
            CharSet: 'utf-8',
            EdiType: 'JSON',
            MallReserved: resultData.ReqReserved,
        },
    };

    console.log('options: ', options);

    const response = await axios(options);
    console.log('response: ',response);
    return response.data;
};

module.exports = {
    createPayments,
};
