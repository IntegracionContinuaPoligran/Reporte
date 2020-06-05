import { Injectable } from '@angular/core';
import { ProyectoModel } from '../models/proyecto.model';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import { map } from 'rxjs/operators';
import { LoginModel } from '../models/login.model';
import { error } from 'protractor';
import { LoginService } from './login.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private headers = {Authorization: ''};
  private controlador = 'proyecto';

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService, private loginService: LoginService,private router: Router ) { }

  nuevoProyecto( proyectoModel: ProyectoModel) {
    const metodo = 'NuevoProyecto';
    const parametros = proyectoModel;
    return this.EnvioPeticion(metodo, parametros);
  }

  editarProyecto( proyectoModel: ProyectoModel) {
    const metodo = 'EditarProyecto';
    const parametros = proyectoModel;
    return this.EnvioPeticion(metodo, parametros);
  }

  ObtenerParametros( ) {
    const metodo = 'Parametros';
    const parametros = '';
    return this.EnvioPeticion(metodo, parametros);
  }

  ObtenerListaProyectos( ) {
    const metodo = 'Proyectos';
    const parametros = '';
    return this.EnvioPeticion(metodo, parametros);
  }
 
  ObtenerProyecto(RegistroVenta: string) {
    const metodo = 'Proyecto';
    const parametros = RegistroVenta;
    return this.EnvioPeticion(metodo, parametros);
  }

  DesabilitarProyecto(RegistroVenta) {
    const metodo = 'DesabilitarProyecto';
    const parametros = RegistroVenta;
    return this.EnvioPeticion(metodo, parametros);
  }

  EnvioPeticion(metodo: string, parametros) {
    this.obtenerToken();
    const headers = this.headers;
    const url = `${this.tokenStorage.ObtenerURL()}/${this.controlador}/${metodo}`;

    return this.http.post<any>(url, parametros, { headers })
      .pipe(
        map((resp) => {
          const respJson = typeof(resp) == 'object' ?  resp : JSON.parse(resp);
          return respJson;
        })
      );
  }

  obtenerToken() {
    this.tokenStorage.select$()
      .subscribe(resp => {
       const token: string =  resp === '' || resp == null || resp === undefined ?  this.tokenStorage.ObtenerCookie() : resp;
       token === '' || token == null || token === undefined ? this.router.navigateByUrl('/login') :
       this.headers.Authorization =  'Bearer ' + token;
      });
    }

  obtenerParametros() {
     return this.tokenStorage.ObtenerParametros();
  }

}
