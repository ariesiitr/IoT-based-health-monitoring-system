require('dotenv').config();

// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const n1 = process.env.number1;
const n2 = process.env.number2;
const client = require('twilio')(accountSid, authToken);


//--------firebase--------/
const firebase = require('firebase');
//const { LogList } = require('twilio/lib/rest/serverless/v1/service/environment/log');


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "sg-project-trial.firebaseapp.com",
    databaseURL: "https://sg-project-trial-default-rtdb.firebaseio.com",
    projectId: "sg-project-trial",
    storageBucket: "sg-project-trial.appspot.com",
    messagingSenderId: "319429089870",
    appId: "1:319429089870:web:afb35693173a866a2e011f",
    measurementId: "G-R1Z1P5G3DE"
};

var temp, pulrat;

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var arr = [n1, n2];

var readref = firebase.database().ref('object');
readref.on('value', (snapshot) => {
    temp = snapshot.val().temperature;
    pulrat = snapshot.val().pulserate;

    if (temp >= 98 || pulrat > 120 || pulrat < 55) {;
        for (i = 0; i < arr.length; i++) {

            client.messages
                .create({

                    body: `patient temperature is ${temp}, patient pulserate is ${pulrat}`,
                    from: '+13602051818',
                    to: arr[i],


                })
                .then(message => console.log(message.sid, ' notif send'));
        }
    } else {
        console.log('no notif');
    }
});