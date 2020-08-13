const express = require('express');
const mongoose = require('mongoose');
const passwordHasher = require('aspnet-identity-pw');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
// var async = require('async');
var router = express.Router();
var User = require('../../models/user');
var Group = require('../../models/group');
const Post = require('../../models/post');
const AppConfig = require('../../models/app-config');
const mw = require('../../models/helpers/my-middleware');
var MyFunction = require('../../models/helpers/my-function');

var config = require('../../config'); // get our config file
var secretKey = config.secret;

router.use('/product', require('./product'));
router.use('/sector', require('./sector'));
// router.use('/wallet', require('./wallet'));
// router.use('/investment', require('./investment'));
// router.use('/user', require('./user'));



router.use('/uploads/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// router.get('/', function(req, res) {
//     res.redirect('/dashboard');
// })


function abc() {
    const https = require('https');
    return new Promise((resolve, reject) => {
        https.get('https://restcountries.eu/rest/v2/all', (resp) => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                var listItems = JSON.parse(data);
                resolve(listItems);

            });
        }).on("error", (err) => {
            reject("error");
        });
    });

}

// router.get('/import-country', async(req, res) => {
//     // var k = await abc();
//     // var Country = require('../models/country');
//     // Country.insertMany(k, function(err, result) {
//     //     res.json(result);
//     // })
// })

router.post('/site-config', async(req, res, next) => {
    console.log(req.body);
    var options = {};
    AppConfig.aggregate([
        { $match: options },
        { $sort: { datecreate: -1 } }
    ]).exec(function(err, result) {
        res.json(result);
    });
})

router.post('/get-slider', async(req, res, next) => {
    var options = { postType: 2 };
    Post.aggregate([
        { $match: options },
        { $sort: { datecreate: -1 } }
    ]).exec(function(err, result) {
        res.json(result);
    });
})

router.get('/verify-email-link/:email', async(req, res, next) => {
    var abc = await User.findOne({ email: req.params.email }).exec();

    res.json('/confirm-email/' + abc.password);
})

router.post('/resend-verify-email/', async(req, res, next) => {
    var abc = await User.findOne({ email: req.body.email });
    if (!abc.verifyEmailCode) {
        abc['verifyEmailCode'] = await MyFunction.RandomString(20);
        // Must be await update unless data will not be change
        await User.findOneAndUpdate({ _id: abc._id }, { verifyEmailCode: abc['verifyEmailCode'] });
    }
    var info = await MyFunction.sendVerifyEmail(abc);
    console.log(info);
    res.json(info);
})

router.get('/confirm-email/:code', async(req, res, next) => {
    // console.log(req.params.code);
    var abc = await User.findOne({ verifyEmailCode: req.params.code }).exec();
    if (abc == null) return res.json('failed');
    await User.findOneAndUpdate({ _id: abc._id }, { verifyEmail: true }).exec();
    res.redirect('/login');
})

var registerMW = [mw.ValidateRegister]
router.post('/register', registerMW, async(req, res, next) => {
    // console.log(req.body); dsf
    var ranStr = await MyFunction.RandomString(20);
    var memberGroup = await Group.findOne({ name: 'member' });
    var max = await User.findOne({
        'groups': {
            '$elemMatch': {
                '$eq': memberGroup._id
            }
        }
    }).sort({ code: -1 });
    var item = {
        username: req.body.username.toLowerCase(),
        email: req.body.email.toLowerCase(),
        password: passwordHasher.hashPassword(req.body.password),
        groups: [memberGroup._id],
        roles: [],
        secret2fa: {},
        facebook: {},
        verifyEmailCode: ranStr,
        code: max.code + 1,
    }

    var checkRefId = await User.findOne({
        code: req.body.refId,
        'groups': {
            '$elemMatch': {
                '$eq': memberGroup._id
            }
        }
    }).exec();

    console.log('checkRefId', checkRefId);
    if (!checkRefId) {
        item.sponsor = '';
        item.idSponsor = null;
        item.sponsorLevel = 0;
        item.sponsorAddress = '';
        item.parentCode = null;
    } else {
        item.sponsor = checkRefId.username;
        item.idSponsor = checkRefId._id;
        item.sponsorLevel = checkRefId.sponsorLevel + 1;
        item.sponsorAddress = checkRefId.sponsorAddress + '-';
        item.parentCode = checkRefId.code;
    }
    // console.log(item.sponsorAddress);
    var countDownLine = await User.countDocuments({ idSponsor: item.idSponsor }).exec();
    item.sponsorAddress += countDownLine;
    // console.log(item.sponsorAddress);
    // console.log('countDownLine', countDownLine, item.sponsorAddress + countDownLine);

    User.addUser(item, async function(result) {
        if (result.status) {
            // var send = await MyFunction.sendVerifyEmail(item);
            // console.log(send);
            res.json(result);
        } else {
            res.json(result);
        }

    })

})


var loginMW = [mw.ValidateLogin]
router.post('/login', loginMW, async(req, res, next) => {
    var e = await User.findOne({ email: req.body.login.toLowerCase() }).exec();
    var u = await User.findOne({ username: req.body.login.toLowerCase() }).exec();
    if (!e && !u) {
        return res.json({ status: false, mes: "Email hoặc username không tồn tại" });
    }
    var getId;
    if (!e) getId = u;
    else getId = e;
    if (!passwordHasher.validatePassword(req.body.password, getId.password)) {
        return res.json({ status: false, mes: 'Password not correct sai mật khẩu' });
    } else {
        var abc = {
            _id: getId._id,
            // info: getId.info,
            code: getId.code,
            parentCode: getId.parentCode,
            email: getId.email,
            username: getId.username,
            // fullname: getId.fullname,
            lock: getId.lock,
            verifyEmail: getId.verifyEmail,
            verifyPhone: getId.verifyPhone,
            // bankInfo: getId.bankInfo,
            sponsor: getId.sponsor,
            idSponsor: getId.idSponsor,
            sponsorAddress: getId.sponsorAddress,
            sponsorLevel: getId.sponsorAddress,
        }
        var token = jwt.sign(abc, secretKey, {
            expiresIn: 60 * 60 * 24 // expires in 24 hours
        });
        res.cookie('x-access-token', token, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
        res.json({ status: true, mes: 'login success', token: token });
    }
    // res.json(getId);;

})

router.get('/*', function(req, res, next) {
    // console.log(req.decoded);
    // res.redirect('/lending');
    res.render('layout/frontPage', {});
})




module.exports = router