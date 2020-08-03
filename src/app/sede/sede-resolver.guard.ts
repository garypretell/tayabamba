import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Resolve,
  Router,
} from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { promise } from 'protractor';
import { AngularFirestore } from '@angular/fire/firestore';
import { catchError, take, map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SedeResolverGuard implements Resolve<Observable<any>> {
  constructor(private afs: AngularFirestore, private router: Router) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return of(this.afs
      .collection(`Sede`, (ref) =>
        ref
          .where('proyecto', '==', route.paramMap.get('p'))
          .orderBy('createdAt', 'asc')
      )
      .valueChanges({ idField: 'id' }));
  }
}
