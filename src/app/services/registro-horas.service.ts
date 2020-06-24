import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { RergistroHoraModel } from '../models/registroHora.model';
import { registroModel } from '../models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroHorasService {
  private headers = {Authorization:''}; 
  private controlador: string = 'registroHoras';

  constructor(
    private http: HttpClient, 
    private tokenStorage: TokenStorageService,    
    private router: Router) { }

   
    ObtenerProyectos() {
      var metodo = 'ObtenerProyectos';
      var parametros = '';
      return this.EnvioPeticion(metodo, parametros);
    }

    ObtenerFases() {
      var metodo = 'ObtenerFases';
      var parametros = '';
      return this.EnvioPeticion(metodo, parametros);
    }

    ObtenerReglas(registro: registroModel) {
      var metodo = 'ObtenerParametrosTipo';
      var parametros = registro;
       return this.EnvioPeticion(metodo, parametros);
    }

    ObtenerEstados() {
      var metodo = 'ObtenerEstadosRegistroTiempos';
      var parametros = '';
       return this.EnvioPeticion(metodo, parametros);
    }

    ObtenerRegistroHorasPorUsuario() {
      var metodo = 'ObtenerRegistroHorasPorUsuario';
      var parametrosSesion = this.obtenerParametros();
      const re = new registroModel();
      re.parametro1= parametrosSesion.usuario;
     return this.EnvioPeticion(metodo, re);
    }

    ActualizarRegistroHoras( registroHora: RergistroHoraModel){
      var metodo = 'ActualizarRegistroHoras';
      var parametros = registroHora;
      return this.EnvioPeticion(metodo, parametros);
    }
   
    EliminarRegistroHoras(idRegistroHora){
      var metodo = 'EliminarRegistroHoras';
      var parametros = {idUsuaidRegistroHorario: idRegistroHora}
      return this.EnvioPeticion(metodo, idRegistroHora);
    }
   
    EnvioPeticion(metodo: string, parametros) {
      this.obtenerToken();
      const headers = this.headers;
      var url =`${this.tokenStorage.ObtenerURL()}/${this.controlador}/${metodo}`;

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
        .subscribe(resp => {         ;
         var token: string=  resp == '' || resp == null || resp == undefined?  this.tokenStorage.ObtenerCookie(): resp         
         token == '' || token == null || token == undefined? this.router.navigateByUrl('/login'):  
         this.headers.Authorization =  'Bearer ' + token; 
        });
  
    }
    obtenerParametros() {
       return this.tokenStorage.ObtenerParametros();
    }
}
