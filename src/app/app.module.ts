import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppHeaderComponent } from './app-header.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AngularSplitModule } from 'angular-split';
import { DragulaModule } from 'ng2-dragula';
import { NgxKjuaModule } from 'ngx-kjua';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ImageViewerModule } from 'ng2-image-viewer';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFirestoreModule,
    NgxChartsModule,
    NgxPaginationModule,
    FilterPipeModule,
    InfiniteScrollModule,
    AngularSplitModule.forRoot(),
    DragulaModule.forRoot(),
    NgxKjuaModule,
    NgxSpinnerModule,
    ImageViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
