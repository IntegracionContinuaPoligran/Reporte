import { Routes, CanActivate } from '@angular/router';
import { LoginGuard } from '../../guards/login.guard';

//Components
import { ProyectosComponent } from '../../pages/proyectos/proyectos.component';

export const AdminLayoutRoutes: Routes = [
   { path: 'proyectos', component: ProyectosComponent },
];


