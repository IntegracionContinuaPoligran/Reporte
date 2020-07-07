import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { registroModel } from '../models/registro.model';
import { ParametroModel } from '../models/parametro.model';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  private headers = {Authorization: ''};
  private controlador = 'parametro';

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router) { }

    obtenerTodosParametros() {
      const metodo = 'ObtenerParametros';
      const parametros = '';
      return this.EnvioPeticion(metodo, parametros);
    }

    obtenerHoraspendientes() {
      const metodo = 'ObtenerHoraspendientes';
      const parametros = '';
      return this.EnvioPeticion(metodo, parametros);
    }

    aprobacionHorasPendientes(registro: registroModel) {
      const metodo = 'AprobacionHorasPendientes';
      const parametros = registro;
      return this.EnvioPeticion(metodo, parametros);
    }

    obtenerParametrosTipo( registro: registroModel) {
      const metodo = 'ObtenerParametrosTipo';
      const parametros = registro;
      return this.EnvioPeticion(metodo, parametros);
    }

    actualizarParametros( listParametros: ParametroModel []) {
      const metodo = 'ActualizarParametros';
      const parametros = listParametros;
      return this.EnvioPeticion(metodo, parametros);
    }

  EnvioPeticion(metodo: string, parametros) {
    this.obtenerToken();
    const headers = this.headers;
    const url = `${this.tokenStorage.ObtenerURL()}/${this.controlador}/${metodo}`;

    return this.http.post<any>(url, parametros, { headers })
      .pipe(
        map((resp) => {
          const respJson = typeof(resp) === 'object' ?  resp : JSON.parse(resp);
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
