import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { registroModel } from '../models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoEquipoService {

  private headers = {Authorization: ''};
  private controlador = 'seguimientoEquipo';

 constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router) { }

    ObtenerRegistroHorasPorEquipo() {
      const metodo = 'ObtenerRegistroHorasEquipoDeTrabajo';
      const parametrosSesion = this.obtenerParametros();
      const re = new registroModel();
      re.parametro1 = parametrosSesion.usuario;
     return this.EnvioPeticion(metodo, re);
    }

    ReporteHistoricoEquipo(registro:registroModel){
      const metodo = 'ObtenerRegistroHorasHistoricoEquipoDeTrabajo';
      const parametrosSesion = this.obtenerParametros();     
      registro.parametro3 = parametrosSesion.usuario;     
     return this.EnvioPeticion(metodo, registro);
    }

    ObtenerEstados(){
      const metodo = 'ObtenerEstadosRegistroTiempos';
      const parametros = '';     
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
