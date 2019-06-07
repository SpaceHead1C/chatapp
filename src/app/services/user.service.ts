import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser = new BehaviorSubject<firebase.User>(this.afauth.auth.currentUser);
  spinner = new BehaviorSubject<boolean>(false);
  error = new BehaviorSubject<Error>({name: '', message: ''});

  constructor(
      private afauth: AngularFireAuth,
      private afs: AngularFirestore,
      private storage: AngularFireStorage) {
    this.afauth.authState.subscribe((user: firebase.User) => {
      this.currentUser.next(user);
    });
  }

  updateNickname(newName) {
    return this.afs.doc('users/' + this.afauth.auth.currentUser.uid).update({
      displayName: newName
    }).then(() => {
      this.afauth.auth.currentUser.updateProfile({
        displayName: newName,
        photoURL: this.afauth.auth.currentUser.photoURL
      });
    });
  }

  updateProfilePic(file) {
    this.spinner.next(true);
    return this.storage.upload('profilepics/' + this.afauth.auth.currentUser.uid, file)
        .then(data => {
          data.ref.getDownloadURL().then(downloadURL => {
            this.afs.doc('users/' + this.afauth.auth.currentUser.uid).update({
              photoURL: downloadURL
            })
                .then(() => {
                  this.afauth.auth.currentUser.updateProfile({
                    displayName: this.afauth.auth.currentUser.displayName,
                    photoURL: downloadURL
                  }).then(() => {
                    this.spinner.next(false);
                  }).catch(err => {
                    this.spinner.next(false);
                    this.error.next(err);
                  });
                }).catch(err => {
                  this.spinner.next(false);
                  this.error.next(err);
                });
          }).catch(err => {
            this.spinner.next(false);
            this.error.next(err);
          });
        }).catch(err => {
          this.spinner.next(false);
          this.error.next(err);
        });
  }

  getAllUsers() {
    return this.afs.collection('users').valueChanges().pipe(map(users => {
      users.forEach((element: any, i) => {
        if (element.email == this.afauth.auth.currentUser.email) {
          users.splice(i, 1);
        }
      });
      return users;
    }));
  }

  getUsers(emails) {
    var userProfiles = [];
    let collRef = this.afs.collection('users').ref;
    emails.forEach(element => {
      const query = collRef.where('email', '==', element.sender);
      query.get().then(snapShot => {
        if (!snapShot.empty) {
          userProfiles.push(snapShot.docs[0].data());
        }
      });
    });
    return userProfiles;
  }
}
