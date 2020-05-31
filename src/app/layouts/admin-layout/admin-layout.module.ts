import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { ClipboardModule } from 'ngx-clipboard';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    ComponentsModule,
    PdfViewerModule
  ],
  declarations: [
 
  ]
})

export class AdminLayoutModule {}
