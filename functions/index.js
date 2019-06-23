const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
// data is what we send to function
// context is information about the user currently signed in
exports.addAdminRole = functions.https.onCall((data, context) =>
  // get user and add custom claim ..admin
  admin
    .auth()
    .getUserByEmail(data.email)
    .then(user =>
      // now that we have the user, set the custom claim, admin:true
      admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
      })
    )
    .then(() => ({ message: `Success ${data.email} is an admin` }))
    .catch(err => err)
);
