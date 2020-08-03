import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  checkBoxValue: boolean;
  validarCodigos: boolean;
  proyecto: any;
  proyectoN: any;
  sedeN: any;
  sede: any;
  constructor(
    public router: Router,
    public afs: AngularFirestore,
    public auth: AuthService,
    public afAuth: AngularFireAuth,
  ) {
    this.checkBoxValue = false;
    this.validarCodigos = false;
  }

  ngOnInit() {
  }

  verificarSede() {
    if (this.proyecto && this.sede) {
      this.afs.firestore.doc(`Sede/${this.sede}`).get()
        .then(async docSnapshot => {
          if (docSnapshot.exists) {
            const datos = docSnapshot.data();
            this.sedeN = datos.nombre;
            if (datos.proyecto === this.proyecto) {
              await this.afs.firestore.doc(`Proyecto/${this.proyecto}`).get().
              then(snapshot => {
                const data = snapshot.data();
                this.proyectoN = data.nombre;
                this.validarCodigos = true;
              });
            }
            else {
              this.validarCodigos = false;
            }
          } else {
            this.validarCodigos = false;
          }
        });
    } else {
      this.validarCodigos = false;
    }

  }

  signInWithGoogle() {
    this.auth.signInWithGoogle().then(() => {
      this.postSignIn();
    });
  }

  postSignIn(): void {
    this.router.navigate(['/Home']);
  }

  createWithGoogle() {
    const proyecto: any = {
      id: this.proyecto,
      nombre: this.proyectoN
    };

    const sede: any = {
      id: this.sede,
      nombre: this.sedeN
    };
    this.auth.createWithGoogle(proyecto, sede).then(() => this.postSignIn());
  }

}
