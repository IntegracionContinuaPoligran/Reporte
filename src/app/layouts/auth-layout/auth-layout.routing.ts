import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    //{ path: 'preguntas', component: PreguntasComponent, canActivate: [LoginGuard], data: { expectedRol: 'Questions' } },
    { path: '**', component: LoginComponent }
];
