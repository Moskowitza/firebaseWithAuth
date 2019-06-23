// Sign up user
const signupForm = document.querySelector('#signup-form');
const logout = document.querySelector('#logout');
const loginForm = document.querySelector('#login-form');
const createForm = document.querySelector('#create-form');
const adminForm = document.querySelector('.admin-actions');

// Make and admin
adminForm.addEventListener('submit', e => {
  e.preventDefault();
  const adminEmail = document.querySelector('#admin-email').value;
  console.log(adminEmail);
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email: adminEmail }).then(res => console.log(res));
});
// connect to database

auth.onAuthStateChanged(user => {
  if (user) {
    console.log(`logged in user: ${JSON.stringify(user)}`);
    // if there is a user, get the climbs

    db.collection('climbs').onSnapshot(
      snapshot => {
        console.log(snapshot.docs);
        setUpClimbs(snapshot.docs);
        setupUI(user);
      },
      err => console.log(err.message)
    );
  } else {
    setUpClimbs([]);
    setupUI(user);
  }
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
        .set({ bio });
    })
    .then(() => {
      // handle the DOM
      const modal = $('#modal-signup');
      modal.modal('hide');
      signupForm.reset();
    })
    .catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
      console.log(`${errorCode}  ${errorMessage}`);
    });
});
// LOG OUT
logout.addEventListener('click', e => {
  e.preventDefault();
  console.log(`signed out`);
  auth.signOut().then(res => {
    // console.log(res);
  });
});
// Login
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;
  auth
    .signInWithEmailAndPassword(email, password)
    .then(res => {
      //   console.log(res.user);
      const modal = $('#modal-login');
      modal.modal('hide');
      loginForm.reset();
    })
    .catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
      console.log(`${errorCode}  ${errorMessage}`);
    });
});
