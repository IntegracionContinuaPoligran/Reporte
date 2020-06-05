import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { ComponentsModule } from '../../components/components.module';

//Components
import { ProyectosComponent } from '../../pages/proyectos/proyectos.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    HttpClientModule,
    NgbModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule
  ],
  declarations: [
    ProyectosComponent
  ]
})

export class AdminLayoutModule {}
