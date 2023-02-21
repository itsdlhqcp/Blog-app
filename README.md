# Blog Application

#### A react application developed using React and Firebase with many features such as - No login: Only view blogs posted by the community | Login: View, post your own blogs, like, set your profile picture and username, update your profile information and delete your own blogs.

## [See live demo](https://firebase-blog-app1.netlify.app/) 🖥️

### Getting started

```
git clone git@github.com:Luise8/blog-app.git
cd blog-app
npm install
npm start
```

Also there are five firestore collections that you have to create:

- `post-like-list/postId, count` // postid: List of users who have liked this post. count: This document has a summary with only postId and number of likes.
- `posts/postId` // Post doc.
- `public/listUsernameAndPhotoURL` // The document containing public users profile data, for now username and photoURL
- `user-liked-posts/userUid` // The list of posts that this user has liked.
- `users/userUid` // User doc.

And there is one storage bucket to images that you have to create:

- `images/posts/postId` // Hero image.
- `images/profile/userUid` // Profile image.

##### Rules to Storage images


```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

      // Rules to user
      match /images/profile/{imageId} {
      allow read: if request.auth != null
      		&& request.auth.uid == imageId;  // Owner
     // Allow to create files subject to the constraints:
     // User auth
     // Restrict to the authenticated owner of the content only
     // File is less than 1MB
     // Content type is an image
     allow create: if request.auth != null
                   && request.auth.uid == imageId  // Owner
                   && request.resource.size < 1 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');

     // Allow to update files subject to the constraints:
     // User auth
     // Restrict to the authenticated owner of the content only
     // File is less than 1MB
     // Content type is an image
     // Uploaded content type matches existing content type
      allow update: if request.auth != null
                   && request.auth.uid == imageId  // Owner
                   && request.resource.size < 1 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*')
                   && request.resource.contentType == resource.contentType

    }

     // Rules to posts
     match /images/posts/{post} {

     // Allow public read access
     allow read: if true;

     // Allow to create files subject to the constraints:
     // User auth
     // File is less than 1MB
     // Content type is an image
      allow create: if request.auth != null
                   && request.resource.size < 1 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');

     // Allow to delete files to the authenticated user
     allow delete: if request.auth != null
    }

```

##### Firestore rules


```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {


    match /users/{ids=**} {
	allow read: if request.auth != null
	match /{id} {
	        allow write: if request.auth != null && request.auth.uid == id
  	}
     }

    // Allow public read access, but only content owners can write
    match /posts/{post} {
        allow read: if true
        allow create: if request.auth != null && request.auth.uid == request.resource.data.authorUid && exists(/databases/$(database)/documents/users/$(request.auth.uid))
        allow delete: if request.auth != null && request.auth.uid == resource.data.authorUid && exists(/databases/$(database)/documents/users/$(request.auth.uid))

    }

    match /post-like-list {

	// Allow public to read access, but only logged user can write
    	match /count {
	        allow read: if true;
                allow write: if request.auth != null && existsAfter(/databases/$(database)/documents/users/$(request.auth.uid));
    		}

  	// Allow public to read access, but only logged user can write
    	match /{post} {
	        allow read: if true;
                allow create: if request.auth != null && existsAfter(/databases/$(database)/documents/posts/$(post));
                allow update: if request.auth != null && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                allow delete: if request.auth != null && get(/databases/$(database)/documents/posts/$(post)).data.authorUid == request.auth.uid && existsAfter(/databases/$(database)/documents/posts/$(post)) == false;
    	}

    }

    // Allow the logged users to read and update, because when a post author deletes his own post,
    // the like list of each user who liked this post must be updated to remove this post
    // from those lists.
    match /user-liked-posts/{userId} {
        allow read, update: if request.auth != null && exists(/databases/$(database)/documents/users/$(request.auth.uid));
        // Only owner can create
        allow create: if request.auth != null && existsAfter(/databases/$(database)/documents/users/$(request.auth.uid))
    }

    // Allow public read access, but only logged user can write
    match /public/listUsernameAndPhotoURL {
	allow read: if true
        allow write: if request.auth != null && existsAfter(/databases/$(database)/documents/users/$(request.auth.uid))
    }
  }
}
```

