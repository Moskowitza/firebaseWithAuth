# Firebase App with Authentication

This template is based on the netNinja's firebase auth tutorial.
Style and functional UI are implemented with Bootstrap 4.

## database permissions

```
service cloud.firestore {
    match /databases/{database}/documents {
        match /user/{uid}{
            allow create: if request.auth.uid !=null;
            allow read: if request.auth.uid==uid;
        }
        match /climbs/{climbId}{
            allow read, write: if request.auth.uid !=null;
        }
    √}
}
```

## Cloud Functions

install firebase CLI:

in terminal :
`firebase init functions`
in editor : create your custom Claim cloud function
to deploy functions
`firebase deploy --only functions`
