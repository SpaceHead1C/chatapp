import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState: any;

  constructor(
      private afauth: AngularFireAuth,
      private afs: AngularFirestore,
      private router: Router) {
    this.afauth.authState.subscribe(user => {
      this.authState = user;
    });
  }

  get currentUserId(): string { return this.authState !== null ? this.authState.uid : ''; }

  signUp(usercreds) {
    return this.afauth.auth.createUserWithEmailAndPassword(usercreds.email, usercreds.password)
        .then(user => {
          this.authState = user.user;
          this.afauth.auth.currentUser.updateProfile({
            displayName: usercreds.displayName,
            photoURL: constants.PROFILE_PIC
          })
              .then(() => {
                this.setUserData(usercreds.email, usercreds.displayName, user.user.photoURL);
              });
        });
  }

  // Set user data to a local user collection
  setUserData(email: string, displayName: string, photoURL: string) {
    const path = `users/${this.currentUserId}`;
    const statuspath = `status/${this.currentUserId}`;
    const userdoc = this.afs.doc(path);
    const status = this.afs.doc(statuspath);
    userdoc.set({
      email: email,
      displayName: displayName,
      photoURL: photoURL
    });
    status.set({ status: 'online' });
    this.router.navigate(['dashboard']);
  }

}
