import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { BehaviorSubject } from 'rxjs';
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
}
