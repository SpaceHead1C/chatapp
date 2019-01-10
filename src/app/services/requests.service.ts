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

  addRequest(newRequest) {
    return this.requestRef.add({
      sender: this.afauth.auth.currentUser.email,
      reciever: newRequest
    });
  }
}
