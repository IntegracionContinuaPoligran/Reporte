import { Routes } from '@angular/router';

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
import { LoginGuard } from 'src/app/guards/login.guard';
import { NoAutorizadoComponent } from '../../pages/no-autorizado/no-autorizado.component';

export const AdminLayoutRoutes: Routes = [

    { path: 'dashboard', component: DashboardComponent, canActivate: [LoginGuard] },
    { path: 'user-profile', component: UserProfileComponent, canActivate: [LoginGuard]  },
    { path: 'proyectos', component: ProyectosComponent , canActivate: [LoginGuard]},
    { path: 'parametros', component: ParametrosComponent , canActivate: [LoginGuard]},
    { path: 'usuarios', component: UsuariosComponent , canActivate: [LoginGuard]},
    { path: 'roles', component: RolesComponent , canActivate: [LoginGuard]},
    { path: 'paginas', component: PaginasComponent , canActivate: [LoginGuard]},
    { path: 'notificaciones', component: NotificacionesComponent, canActivate: [LoginGuard] },
    { path: 'reporteTiempos', component: ReporteTiemposComponent , canActivate: [LoginGuard]},
    { path: 'aprobacionHoras', component: AprobacionHorasComponent, canActivate: [LoginGuard] },
    { path: 'aprobacionAutomaticos', component: AprobacionAutomaticosComponent , canActivate: [LoginGuard]},
    { path: 'horasAutomaticas', component: HorasAutomaticasComponent , canActivate: [LoginGuard]},
    { path: 'seguimientoEquipos', component: SeguimientoEquiposComponent , canActivate: [LoginGuard]},
    { path: 'reporteFinanciero', component: ReporteComponent , canActivate: [LoginGuard]},
    { path: 'seguimientoEquipoReporte', component: SeguimientoEquipoReporteComponent , canActivate: [LoginGuard]},
    { path: 'noAutorizado', component: NoAutorizadoComponent},
];
