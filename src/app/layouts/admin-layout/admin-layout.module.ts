import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
 import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
 
import { AdminLayoutRoutes } from './admin-layout.routing';
import { ComponentsModule } from '../../components/components.module';
import { FormulariosModule } from '../../formularios/formularios.module';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { ReporteTiemposComponent } from '../../pages/reporte-tiempos/reporte-tiempos.component';
import { ProyectosComponent } from '../../pages/proyectos/proyectos.component';
import { ParametrosComponent } from '../../pages/parametros/parametros.component';
import { UsuariosComponent } from '../../pages/usuarios/usuarios.component';
import { RolesComponent } from '../../pages/roles/roles.component';
import { PaginasComponent } from '../../pages/paginas/paginas.component';
import { NotificacionesComponent } from '../../pages/notificaciones/notificaciones.component';
import { AprobacionHorasComponent } from '../../pages/aprobacion-horas/aprobacion-horas.component';
import { AprobacionAutomaticosComponent } from '../../pages/aprobacion-automaticos/aprobacion-automaticos.component';
import { HorasAutomaticasComponent } from '../../pages/horas-automaticas/horas-automaticas.component';
import { SeguimientoEquiposComponent } from '../../pages/seguimiento-equipos/seguimiento-equipos.component';
import { ReporteComponent } from '../../pages/reporte/reporte.component';
import {SeguimientoEquipoReporteComponent  } from '../../pages/seguimiento-equipo-reporte/seguimiento-equipo-reporte.component';
import { NoAutorizadoComponent } from '../../pages/no-autorizado/no-autorizado.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    HttpClientModule,
    NgbModule,
    ComponentsModule,
    FormulariosModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    ReporteTiemposComponent,
    ProyectosComponent,
    ParametrosComponent,
    UsuariosComponent,
    RolesComponent,
    PaginasComponent,
    NotificacionesComponent,
    AprobacionHorasComponent,
    AprobacionAutomaticosComponent,
    HorasAutomaticasComponent,
    SeguimientoEquiposComponent,
    ReporteComponent,
    SeguimientoEquipoReporteComponent,
    NoAutorizadoComponent
  ]
})

export class AdminLayoutModule {}
