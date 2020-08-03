import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

import { Observable, of, from, BehaviorSubject } from 'rxjs';
import { switchMap, map, first } from 'rxjs/operators';
import { User } from './user';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, firestore } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authenticated$: Observable<boolean>;
  user$: Observable<any>;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.authenticated$ = afAuth.authState.pipe(map(user => !!user));
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<any>(`usuarios/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }));
  }

  async signIn(provider: firebase.auth.AuthProvider) {
    return await this.afAuth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
      })
      .catch(error => console.log('ERROR @ AuthService#signIn() :', error));
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  signInWithGoogle() {
    return this.signIn(new firebase.auth.GoogleAuthProvider());
  }

  async signOut() {
    await this.afAuth.signOut();
  }

  createWithGoogle(proyecto, sede) {
    return this.createAccount(new firebase.auth.GoogleAuthProvider(), proyecto, sede);
  }

  createAccount(provider: firebase.auth.AuthProvider, proyecto, sede) {
    return this.afAuth.signInWithPopup(provider)
      .then((credential) => {
        this.createUserData(credential.user, proyecto, sede);
      })
      .catch(error => console.log('ERROR @ AuthService#signIn() :', error));
  }

  private async createUserData(user, miproyecto, misede) {
    const usuarioRef: AngularFirestoreDocument<any> = this.afs.doc
      (`usuarios/${user.uid}`);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`usuarios/${user.uid}`);

    const data: any = {
      lastSesion: Date.now(),
      uid: user.uid,
      proyecto: miproyecto,
      displayName: user.displayName,
      foto: user.photoURL,
      sede: misede,
      email: user.email,
      estado: true,
      roles: {
        subscriber: true,
        editor: true,
        admin: false,
        super: false
      }
    };
    await this.afs.doc(`Proyecto/${miproyecto.id}`).update({
      usuarios: firestore.FieldValue.arrayUnion({ uid: user.uid, displayName: user.displayName,
        foto: user.photoURL,  proyecto: miproyecto, sede: misede, admin: false})});
    await this.afs.doc(`Sede/${misede.id}`).update({
      usuarios: firestore.FieldValue.arrayUnion({ uid: user.uid, displayName: user.displayName,
        foto: user.photoURL,  sede: misede})});
    return usuarioRef.set(data);
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`usuarios/${user.uid}`);
    const data: any = {
      lastSesion: firebase.firestore.FieldValue.serverTimestamp(),
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      foto: user.photoURL,
      estado: true,
      roles: {
        subscriber: true
      }
    };
    return userRef.set(data, { merge: true });
  }

  ///// Role-based Authorization /////

  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber', 'super'];
    return this.checkAuthorization(user, allowed);
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor', 'super'];
    return this.checkAuthorization(user, allowed);
  }

  canDelete(user: User): boolean {
    const allowed = ['admin', 'super'];
    return this.checkAuthorization(user, allowed);
  }

  canSuper(user: User): boolean {
    const allowed = ['super'];
    return this.checkAuthorization(user, allowed);
  }

  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    // tslint:disable-next-line:curly
    if (!user) return false;
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
  }
}


