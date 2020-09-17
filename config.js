const ip = require("ip").address();

var publicPath = '';
var databaseCF = {
    connectStr: 'mongodb://149.28.152.179:27118/bds-toduong',
    options: {
        // keepAlive: true,
        // reconnectTries: Number.MAX_VALUE,
        // useMongoClient: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        replicaSet: 'rs0',
        user: 'toduong',
        pass: 'toduong!@#@123'
    }

}
if (ip == '149.28.152.179') {
    console.log(' o server');
    databaseCF = {
        connectStr: 'mongodb://149.28.152.179:27118/bds-toduong',
        options: {
            keepAlive: true,
            reconnectTries: Number.MAX_VALUE,
            // useMongoClient: true,
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            replicaSet: 'rs0',
            user: 'toduong',
            pass: 'toduong!@#@123'
        }
    }
    publicPath = '/home/bds-toduong/';
}


module.exports = {
    fcmKey: 'AAAAyNKgGwg:APA91bGDhrIXPvI7chnyynRg5aKmDtDFT6xYhZF5l1ierwW-MPtdkullvdOotpa3byGlzHVxY6gRa_ZQsZ92BzH6OJICU3astb5LDtNUvjQIsyehmfzPsGTFgoajjtqzO837nwWwErad',
    'serverSeed': '1199932bf7dbcea2030fa899f6f591bd09511a49857a67134ab384d7c6fba4a5',
    'clientSeed': '000000000000000007a9a31ff7f07463d91af6b5454241d5faf282e5e0fe1b3a',
    'secret': 'alluneedev',
    'database': databaseCF,
    'publicPath': publicPath,
    'allowIP': '127.0.0.1',
    'reCaptchaKey': '6LeQNjsUAAAAAODIAq8fxuXiLHwtLuAoIuy2LnfT',
    'reCaptchaKSecrect': '6LeQNjsUAAAAAMQMspip8e39YQEcC8jKxIOq6Vhp',
    'reCaptchaKeyLocal': '6LfXNjsUAAAAAOPfroYZRzkZTlhKhjTxMQWC3ykd',
    'reCaptchaKSecrectLocal': '6LfXNjsUAAAAABRRFz1eZ5Ujx85voFdBFom6bo8E',
    directions: [
    ]

};