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
export class RequestsService {

  constructor(private afs: AngularFirestore, private afauth: AngularFireAuth) { }
  
  requestRef = this.afs.collection('requests');
  friendsRef: firebase.firestore.CollectionReference = this.afs.collection('friends').ref;

  addRequest(newRequest) {
    return this.requestRef.add({
      sender: this.afauth.auth.currentUser.email,
      reciever: newRequest
    });
  }

  getMyRequests() {
    return this.afs
        .collection('requests', ref => ref.where('reciever', '==', this.afauth.auth.currentUser.email))
        .valueChanges();
  }

  acceptRequest(req) {
    return new Promise(resolve => {
      const query = this.friendsRef.where('email', '==', this.afauth.auth.currentUser.email);
      const reQuery = this.friendsRef.where('email', '==', req.email);

      query.get().then(snapShot => {
        if (snapShot.empty) {
          this.friendsRef.add({
            email: this.afauth.auth.currentUser.email
          }).then(docRef => {
            this.friendsRef.doc(docRef.id).collection('myfriends').add({
              email: req.email
            });
          });
        } else {
          this.afs.doc('friends/' + snapShot.docs[0].id).collection('myfriends').add({
            email: req.email
          });
        }
      }).then(() => {
        reQuery.get().then(snapShot => {
          if (snapShot.empty) {
            this.friendsRef.add({
              email: req.email
            }).then(docRef => {
              this.friendsRef.doc(docRef.id).collection('myfriends').add({
                email: this.afauth.auth.currentUser.email
              });
            });
          } else {
            this.afs.doc('friends/' + snapShot.docs[0].id).collection('myfriends').add({
              email: this.afauth.auth.currentUser.email
            });
          }
        });
      }).then(() => {
        this.deleteRequest(req).then(() => {
          resolve(true);
        })
      });
    });
  }

  deleteRequest(req) {
    return new Promise(resolve => {
      const requestColl = this.requestRef.ref;
      const query = requestColl.where('sender', '==', req.email);

      query.get().then(snapShot => {
        snapShot.docs[0].ref.delete().then(() => {
          resolve(true);
        });
      });
    });
  }
}
