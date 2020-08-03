import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ProyectoService } from '../proyecto.service';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';
declare var jQuery: any;
@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @ViewChild('myModal') myModal: ElementRef;
  @ViewChild('myModalEdit') myModalEdit: ElementRef;

  searchObject: any = { nombre: '' };
  p = 1;
  proyectotoEdit: any = {};
  editProyecto: boolean;
  public addProyectoForm: FormGroup;
  public editProyectoForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    public proyectoService: ProyectoService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.addProyectoForm = this.formBuilder.group({
      nombre:  ['', [Validators.required ]],
      estado:  [''],
      total_registros:  [''],
      transferencia: [''],
      secretarias: [''],
      sedes: [''],
      createdAt: [''],
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  limpiarB() {
    this.searchObject.nombre = '';
  }

  showModal() {
    jQuery(this.myModal.nativeElement).modal('show');
  }

  enableEditing(event, diocesis) {
    this.afs.doc(`Proyecto/${diocesis.id}`).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.proyectotoEdit = data;
    });
    jQuery(this.myModalEdit.nativeElement).modal('show');
    this.editProyecto = true;
  }

  addProyecto() {
    this.afs.firestore.doc(`Proyecto/${(this.addProyectoForm.value.nombre).replace(/ /g, '')}`).get()
    .then(docSnapshot => {
      if (docSnapshot.exists) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Este proyecto ya ha sido registrado!'
        });
        this.addProyectoForm.reset();
      } else {
        this.addProyectoForm.value.transferencia = false;
        this.addProyectoForm.value.estado = true;
        this.addProyectoForm.value.total_registros = 0;
        this.addProyectoForm.value.secretarias = [];
        this.addProyectoForm.value.sedes = [];
        this.addProyectoForm.value.createdAt = Date.now();
        const diocesis = this.afs.doc(`Proyecto/${(this.addProyectoForm.value.nombre).replace(/ /g, '')}`);
        diocesis.set(this.addProyectoForm.value, { merge: true });
        this.addProyectoForm.reset();
      }
    });
  }

  updateProyecto(proyectotoEdit) {
    this.proyectoService.updateProyectos(this.proyectotoEdit);
    jQuery(this.myModalEdit.nativeElement).modal('hide');
  }

  deleteProyecto(proyecto) {
    if (confirm('Esta seguro de eliminar este proyecto?')) {
      this.proyectoService.removeProyectos(proyecto);
    }
  }

  getColor(color) {
    switch (color) {
      case true:
        return 'black';
      case false:
        return 'red';
    }
  }

  goSedes(doc) {
    this.router.navigate(['/proyecto', doc.id, 'sede']);
  }

  trackByFn(index, item) {
    return item.id;
  }
}
