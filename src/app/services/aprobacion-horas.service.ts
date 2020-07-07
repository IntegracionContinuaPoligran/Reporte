import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { registroModel } from '../models/registro.model';
import { CalificacionRegistroHorasModel } from '../models/calificacionRegistroHoras.model';

@Injectable({
  providedIn: 'root'
})
export class AprobacionHorasService {

  private headers = {Authorization: ''};
  private controlador = 'aprobacionHoras';

 constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router) { }


    ObtenerParametrosRH(registro: registroModel) {
      const metodo = 'ObtenerParametrosTipo';
       return this.EnvioPeticion(metodo, registro);
    }

    ObtenerRegistroHorasPorRegistroVenta(registro: registroModel) {
      const metodo = 'ObtenerRegistroHorasPorRegistroVenta';
       return this.EnvioPeticion(metodo, registro);
    }

    ObtenerProyectosPorUsuario(re: registroModel) {
      const metodo = 'ObtenerProyectosPorUsuario';
      const parametrosSesion = this.obtenerParametros();      
      re.parametro1 = parametrosSesion.usuario;
     return this.EnvioPeticion(metodo, re);
    }

    ObtenerRegistroHorasPorResponsableProyecto(re: registroModel) {
      const metodo = 'ObtenerRegistroHorasResponsableProyectos';
      const parametrosSesion = this.obtenerParametros();      
      re.parametro1 = parametrosSesion.usuario;
     return this.EnvioPeticion(metodo, re);
    }

    ObtenerEstados() {
      const metodo = 'ObtenerEstadosRegistroTiempos';
      const parametros = '';
      return this.EnvioPeticion(metodo, parametros);
    }

    CalificarRegistroHorasLista( calificacionRegistro: CalificacionRegistroHorasModel []) {
      const metodo = 'CalificarRegistroHorasLista';
      const parametros = calificacionRegistro;
      return this.EnvioPeticion(metodo, parametros);
    }

    CalificarRegistroHorasMasivo( calificacionRegistro: CalificacionRegistroHorasModel) {
      const metodo = 'CalificarRegistroHorasMasivo';
      const parametros = calificacionRegistro;
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
