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

  authUser(): boolean {
    return this.authState !== null && this.authState !== undefined;
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

  login(usercreds) {
    return this.afauth.auth.signInWithEmailAndPassword(usercreds.email, usercreds.password)
        .then(user => {
          this.authState = user.user;
          const status = 'online';
          this.setUserStatus(status);
          this.router.navigate(['dashboard']);
        }).catch(err => {
          console.log(err);
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
    status.set({ 
      email: email,
      status: 'online'
    });
    this.router.navigate(['dashboard']);
  }

  setUserStatus(status) {
    const statuscollection = this.afs.doc(`status/${this.currentUserId}`);
    const data = { status: status };
    statuscollection.update(data).catch(err => {
      console.log(err);
    });
  }

}
