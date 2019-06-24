# Firebase App with Authentication

This template is based on the netNinja's firebase auth tutorial.

- implement bootstrap
- reset password
- save climbs to your list
  ###TODOs
  -- load saved climbs on login (i think this is working)
  -- can't save Bunny for some reason
  -- Need to account for loading!!!
  -- _still need to hook up remove button_

## database permissions

```
service cloud.firestore {
  match /databases/{database}/documents {
    // match /{document=**} {
    //   allow read, write;
    // }
    match /users/{uid}{
  	allow create: if request.auth.uid !=null;
    allow read: if request.auth.uid==uid;
  }
  	match /climbs/{climbId}{
  	allow read: if request.auth.uid !=null;
    allow write: if request.auth.token.admin == true;
  }
      match /usersClimbs/{userId}{
       allow read, update, delete: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;
      }
  }
}
```

## Cloud Functions

To make usres admins to add new routes to the database:

install firebase CLI

in terminal :
`firebase init functions`
in editor : create your custom Claim cloud function
to deploy functions
`firebase deploy --only functions`

- code is in ./functions/index.js
