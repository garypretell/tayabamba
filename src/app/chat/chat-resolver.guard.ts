import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Resolve,
  Router,
} from '@angular/router';
import { Observable, EMPTY, of, combineLatest } from 'rxjs';
import { promise } from 'protractor';
import { AngularFirestore } from '@angular/fire/firestore';
import { catchError, take, map, first, flatMap,  switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatResolverGuard implements Resolve<Observable<any[]>> {
  constructor(private afs: AngularFirestore, private router: Router, public auth: AuthService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {

    return Observable.create(observer => {
      this.auth.user$.pipe(switchMap(da => {
        return this.afs.collection('usuarios', ref => ref.where('diocesis.id', '==', da.diocesis.id)
        .where('roles.admin', '==', true)
        .orderBy('lastSesion', 'desc')).valueChanges().pipe(map(datos => {
          return datos.map((change: any) => {
            const data = change;
            const user = data.uid;
            const roomname = (da.uid < user ? da.uid + user : user +  da.uid);
            const recibe = 'recibe_' + da.uid;
            const col = this.afs.collection(
              `mensajes`,
              ref => ref.where('chatId', '==', roomname ).where('recibe', '==', da.uid).where('estado', '==', recibe).
              orderBy('fecha', 'asc')
            );
            return col.valueChanges().pipe(
              map(ratings => Object.assign(data, { ratings }))
            );
          });
        }),
        flatMap(feeds => combineLatest(feeds))
        );
      })).subscribe(data => {
              observer.next(data);
              observer.complete();
      });
    });

  }
}
