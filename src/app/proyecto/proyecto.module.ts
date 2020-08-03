import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectoComponent } from './proyecto/proyecto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProyectoRoutingModule } from './proyecto.route';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';



@NgModule({
  declarations: [ProyectoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProyectoRoutingModule,
    NgxPaginationModule,
    FilterPipeModule
  ]
})
export class ProyectoModule { }
