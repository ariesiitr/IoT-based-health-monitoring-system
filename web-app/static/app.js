// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyBSbuwdEwP_SSOBhdmiiwfJiHQ8NU_wQ0w",
    authDomain: "sg-project-trial.firebaseapp.com",
    databaseURL: "https://sg-project-trial-default-rtdb.firebaseio.com",
    projectId: "sg-project-trial",
    storageBucket: "sg-project-trial.appspot.com",
    messagingSenderId: "319429089870",
    appId: "1:319429089870:web:afb35693173a866a2e011f",
    measurementId: "G-R1Z1P5G3DE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var plug = "off",
    lat, lng,
    temp, pul,
    d;


//------auth------/   
const auth = firebase.auth();

const signout_btn = document.getElementById('ctrl1');


//--------Method --------/

var database = firebase.database();

//-----switching on/off------/
function control() {
    if (plug == "off") {

        plug = "on";
        document.getElementById('ctrl').classList.add('active');
        firebase.database().ref('object').update({
            switch: plug
        })
    } else {
        plug = "off";
        document.getElementById('ctrl').classList.remove('active');
        firebase.database().ref('object').update({
            switch: plug
        })
    }
}
document.getElementById('ctrl').onclick = control;



//---------retrieving the data-------/
var readref = firebase.database().ref('object');
readref.on('value', (snapshot) => {
    document.getElementById('temp').innerHTML = snapshot.val().temperature;
    document.getElementById('pulrat').innerHTML = snapshot.val().pulserate;
    temp = snapshot.val().temperature;
    pul =  snapshot.val().pulserate;
    lat = snapshot.val().latitude;
    lng = snapshot.val().longitude;
    myGoogleMap(lat, lng);
    notify(temp, pul);
    d = new Date();
    print_time(d);
});



//------time-------/
function print_time(d) {
    document.getElementById('time').innerHTML = d;
}




//------notification------/
function notify(temp, pul) {
    if (temp > 98) {
        document.getElementById('notify1').style.display = 'block';
        document.getElementById('temp-notify').style.border = '4px solid red';
        document.getElementById('temp-notify').style.boxShadow = ' 0 0 1rem rgb(247, 106, 106)';
    } else {
        document.getElementById('notify1').style.display = 'none';
        document.getElementById('temp-notify').style.border = '4px solid rgb(6, 218, 6)';
        document.getElementById('temp-notify').style.boxShadow = '0 0 1rem rgb(38, 219, 38)';

    }
    if (pul > 120 || pul < 55) {
        document.getElementById('notify2').style.display = 'block';
        document.getElementById('pul-notify').style.border = '4px solid red';
        document.getElementById('pul-notify').style.boxShadow = '0 0 1rem rgb(247, 106, 106)';
    } else {
        document.getElementById('notify2').style.display = 'none';
        document.getElementById('pul-notify').style.border = '4px solid rgb(6, 218, 6)';
        document.getElementById('pul-notify').style.boxShadow = '0 0 1rem rgb(38, 219, 38)';
    }
}



//---------location----------/

function myGoogleMap(lat, lng) {
    let location = {
        lat,
        lng
    };
    if (lat && lng) {
        try {
            let mapProp = {
                center: new google.maps.LatLng(location.lat, location.lng),
                zoom: 5,
            };
            let map = new google.maps.Map(document.getElementById("loc"), mapProp);
            let marker = new google.maps.Marker({
                position: location,
                map: map
            });
            google.maps.event.addListener(marker, 'click', function() {
                map.setZoom(15);
                map.setCenter(marker.getPosition());
            });
        } catch (error) {
            throw error;
        }
    }
}

//--------sign out-------/

signout_btn.addEventListener('click', e => {

    auth.signOut().then(() => {
        // Sign-out successful.
        console.log('signout');
        window.location.href = '/login';

    }).catch((error) => {
        // An error happened.
    });

});

auth.onAuthStateChanged(firebaseUser => {

    if (!firebaseUser) {
        console.log('main not loggedin');
        window.location = "/login";
    }
});