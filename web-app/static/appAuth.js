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
var email, pwd;


// Initialize Firebase
firebase.initializeApp(firebaseConfig);




//----------auth---------/

const auth = firebase.auth();
//const db = firebase.database();


//---------recieving-----/


const txtemail = document.getElementById('email');
const txtpwd = document.getElementById('pwd');
const signin_btn = document.getElementById('signin_btn');
const signup_btn = document.getElementById('signup_btn');
const signout_btn = document.getElementById('signout_btn');



//-------sign in------/


signin_btn.addEventListener('click', e => {

    const email = txtemail.value;
    const pwd = txtpwd.value;

    auth.signInWithEmailAndPassword(email, pwd)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            // ...
            //console.log(user);
            // window.location.href = '/';
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
        });

});



//-------sign up-------/


signup_btn.addEventListener('click', e => {

    const email = txtemail.value;
    const pwd = txtpwd.value;

    auth.createUserWithEmailAndPassword(email, pwd)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            // ...
            // window.location.href = '/';
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        });
});


//--------sign out-------/

signout_btn.addEventListener('click', e => {

    auth.signOut().then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });

});

//-----realtime listener---/


auth.onAuthStateChanged(firebaseUser => {

    if (firebaseUser) {
        window.location = "/";
        console.log(firebaseUser);
        signout_btn.style.display = "block";
        signin_btn.style.display = "none";
        signup_btn.style.display = "none";

    } else {
        console.log(window.location.pathname);
        if (window.location.pathname !== "/login") {
            console.log('redeee');
            window.location = "/login"
        }
        console.log('not logged in');
        signout_btn.style.display = "none";
        signin_btn.style.display = "block";
        signup_btn.style.display = "block";
    }
});