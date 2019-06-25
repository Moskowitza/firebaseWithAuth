// Sign up user
const signupForm = document.querySelector('#signup-form');
const logout = document.querySelector('#logout');
const loginForm = document.querySelector('#login-form');
const createForm = document.querySelector('#create-form');
const adminForm = document.querySelector('.admin-actions');
const resetForm = document.querySelector('#reset-request-form');
// For saving climbs to your array

const userId = null;
let savedClimbObjs = [];
// connect to database
// Set user db string
let userdb = null;

auth.onAuthStateChanged(user => {
  if (user) {
    userdb = db.collection('users').doc(user.uid);
    // console.log(`logged in user: ${JSON.stringify(user)}`);
    // if there is a user, get the climbs
    user.getIdTokenResult().then(idTokenResult => {
      // if this is true, set a new property to the user
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });

    db.collection('climbs').onSnapshot(
      snapshot => {
        setUpClimbs(snapshot.docs);
      },
      err => console.error(err.message)
    );
    userdb.onSnapshot(
      snapshot => {
        const usersClimbs = snapshot.data().savedClimbsArray;
        usersClimbs ? getSavedClimbsDeets(usersClimbs) : getSavedClimbsDeets([]);
      },
      err => console.error(err.message)
    );
  } else {
    setUpClimbs([]);
    setupUI(user);
    displaySavedClimbs([]);
  }
});
// TODO: FIX this to work with array method
function getSavedClimbsDeets(ticklist) {
  savedClimbObjs = [];
  if (ticklist.length) {
    ticklist.forEach(climb => {
      db.collection('climbs')
        .doc(climb)
        .get()
        .then(function(doc) {
          const { routeName, grade } = doc.data();
          const climbObj = { id: climb, routeName, grade };
          savedClimbObjs.push(climbObj);
        })
        .then(() => {
          console.log(`getSavedClimbsDeets, before displaySavedClimbs:${JSON.stringify(savedClimbObjs)} `);
          displaySavedClimbs(savedClimbObjs);
        })
        .catch(err => console.error(err));
    });
  } else {
    displaySavedClimbs([]);
  }
}

// Call this function when save button is clicked
function saveClimb(climbId) {
  userdb.update({
    savedClimbsArray: firebase.firestore.FieldValue.arrayUnion(climbId),
  });
}
// save the changes to firebase
function removeClimb(climbId) {
  userdb.update({
    savedClimbsArray: firebase.firestore.FieldValue.arrayRemove(climbId),
  });
}
// Reset Email
resetForm.addEventListener('submit', e => {
  e.preventDefault();
  const emailAddress = resetForm['reset-request-email'].value;
  auth
    .sendPasswordResetEmail(emailAddress)
    .then(function() {
      const modal = $('#modal-reset-request');
      modal.modal('hide');
      resetForm.reset();
    })
    .catch(function(error) {
      const errorMessage = error.message;
      resetForm.querySelector('.error').innerHTML = errorMessage;
    });
});
// Make and admin
adminForm.addEventListener('submit', e => {
  e.preventDefault();
  const adminEmail = document.querySelector('#admin-email').value;
  console.log(adminEmail);
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email: adminEmail }).then(res => console.log(res));
});

// create form
createForm.addEventListener('submit', e => {
  e.preventDefault();
  const routeName = createForm.routeName.value;
  const grade = createForm.grade.value;
  console.log(grade + routeName);
  db.collection('climbs')
    .add({
      routeName,
      grade,
    })
    .then(res => {
      console.log(res);
      const modal = $('#modal-create');
      modal.modal('hide');
      createForm.reset();
    })
    .catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
      console.log(`${errorCode}  ${errorMessage}`);
    });
});
// SIGN UP NEW USER
signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;
  const bio = signupForm['user-bio'].value;
  console.log(bio);
  //  Create the user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(res => {
      //  Save the bio
      db.collection('users')
        .doc(res.user.uid)
        .set({ bio, savedClimbsArray: [] });
    })
    .then(() => {
      // handle the DOM
      const modal = $('#modal-signup');
      modal.modal('hide');
      signupForm.reset();
      signupForm.querySelector('.error').innerHTML = '';
    })
    .catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
      signupForm.querySelector('.error').innerHTML = errorMessage;
      console.error(`${errorCode}  ${errorMessage}`);
    });
});
// LOG OUT
logout.addEventListener('click', e => {
  e.preventDefault();
  auth
    .signOut()
    .then(res => {
      // console.log(res);
    })
    .catch(err => console.error(err));
});
// Login
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;
  auth
    .signInWithEmailAndPassword(email, password)
    .then(res => {
      const modal = $('#modal-login');
      modal.modal('hide');
      loginForm.reset();
      loginForm.querySelector('.error').innerHTML = '';
    })
    .catch(function(error) {
      // Handle Errors here.
      const { code, message } = error;
      loginForm.querySelector('.error').innerHTML = message;
      console.error(`${code}  ${message}`);
    });
});
