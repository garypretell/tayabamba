import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewChecked } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { SedeService } from '../../sede.service';
import { Observable, Subject } from 'rxjs';
import { switchMap, map, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as firebase from 'firebase/app';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-libro',
  templateUrl: './libro.component.html',
  styleUrls: ['./libro.component.css']
})
export class LibroComponent implements OnInit, OnDestroy, AfterViewChecked {
  numLibro: any;
  message: any;
  private unsubscribe$ = new Subject();
  @ViewChild('addMLibro') addMLibro: ElementRef;
  @ViewChild('myToast') myToast: ElementRef;
  addLibroForm: FormGroup;

  miproyecto: any;
  proyecto: any;
  misede: any;
  sede: any;
  documento: any;
  midocumento: any;
  topList$: Observable<any>;
  tipoBusqueda: boolean;
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private afs: AngularFirestore,
    private activatedroute: ActivatedRoute,
    public sedeService: SedeService
  ) { }

  sub;
  ngOnInit() {
    this.tipoBusqueda = true;
    this.sub = this.activatedroute.paramMap.pipe(map(params => {
      this.miproyecto = params.get('p');
      this.misede = params.get('s');
      this.documento = params.get('d');
      this.midocumento = this.misede + '_' + this.documento;
      this.topList$ = this.afs.collection(`Libros`, ref => ref.where('proyecto', '==', this.miproyecto)
      .where('sede', '==', this.misede)
      .where('documento', '==', this.midocumento).orderBy('createdAt', 'desc').limit(6)).valueChanges();
    })).subscribe();

    this.afs.doc(`Proyecto/${this.miproyecto}`).valueChanges().pipe(switchMap((m: any) => {
      return this.afs.doc(`Sede/${this.misede}`).valueChanges().pipe(map((data: any) => {
        this.proyecto = {nombre: m.nombre, id: data.proyecto};
        this.sede = {nombre: data.nombre, id: data.sede};
      }));
    }), takeUntil(this.unsubscribe$)).subscribe();

    this.addLibroForm = this.formBuilder.group({
      numLibro: ['', [Validators.required]]
    });
  }

  ngAfterViewChecked() {
    $('.toast').toast('show');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addLibro() {
    const libro: any = {
      contador: 0,
      proyecto: this.miproyecto,
      sede: this.misede,
      documento: this.midocumento,
      nomdoc: this.documento,
      numLibro: this.addLibroForm.value.numLibro,
      createdAt: Date.now(),
      imagenes: []
    };

    const id = this.misede + '_' + this.documento + '_' + this.addLibroForm.value.numLibro;
    this.afs.firestore.doc(`Libros/${id}`).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Este libro ya existe!',
          });
          this.addLibroForm.reset();
        } else {
          const ruta = this.misede + '_' + this.documento;
          const datos = { Libros: firebase.firestore.FieldValue.increment(1) };
          this.afs.doc(`Documentos/${ruta}`).set(datos, { merge: true });
          this.afs.doc(`Libros/${id}`).set(libro);
          this.addLibroForm.reset();
        }
      });
  }

  goLibro() {
    if (this.numLibro) {
      if (this.tipoBusqueda) {
        this.router.navigate(['/proyecto', this.miproyecto, 'sede', this.misede,
        'documentos', this.documento, 'libros', this.numLibro, 'registrar']);
      } else {
        this.router.navigate(['/proyecto', this.miproyecto, 'sede', this.misede,
        'documentos', this.documento, 'libros', this.numLibro]);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ingrese número de libro a buscar!',
      });

    }
  }

  mostrarTodo() {
    this.router.navigate(['/proyecto', this.miproyecto, 'sede', this.misede, 'documentos', this.documento, 'listado']);
  }

  goListado(libro) {
    this.router.navigate(['/proyecto', this.miproyecto, 'sede', this.misede, 'documentos',
     this.documento, 'libros', libro.numLibro]);
  }

  goRegistrar(libro) {
    this.router.navigate(['/proyecto', this.miproyecto, 'sede', this.misede,
        'documentos', this.documento, 'libros', libro.numLibro, 'registrar']);
  }

  goUpload(libro) {
    this.router.navigate(['/proyecto', this.miproyecto, 'sede', this.misede,
        'documentos', this.documento, 'libros', libro.numLibro, 'upload']);
  }

  showModal() {
    jQuery(this.addMLibro.nativeElement).modal('show');
  }

  goDocumentos() {
    this.router.navigate(['/proyecto', this.miproyecto, 'sede', this.misede, 'documentos']);
  }

  goSede() {
    this.router.navigate(['/proyecto', this.miproyecto, 'sede', this.misede]);
  }

}
