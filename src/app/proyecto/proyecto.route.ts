import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard, EditorGuard, SuperGuard } from '../auth/guards';
import { ProyectoComponent } from './proyecto/proyecto.component';



const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ProyectoComponent, pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProyectoRoutingModule { }
