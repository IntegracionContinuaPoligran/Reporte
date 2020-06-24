import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AutomaticoModel } from '../models/automatico.model';
import { registroModel } from '../models/registro.model';
import { AutomaticoPorUsuarioModel } from '../models/automaticoPorUsuario.model';

@Injectable({
  providedIn: 'root'
})
export class AutomaticoService {
  private headers = {Authorization:''};
  private controlador = 'automatico';
 

  constructor(
    private http: HttpClient, 
    private tokenStorage: TokenStorageService,    
    private router: Router) { }


    ObtenerProyectos() {
      const metodo = 'ObtenerProyectos';
      const parametros = '';
      return this.EnvioPeticion(metodo, parametros);
    }  
    
    ObtenerUsuarios() {
      const metodo = 'ObtenerUsuarios';
      const parametros = '';
      return this.EnvioPeticion(metodo, parametros);
    }  

    ObtenerAutomaticosPorUsuario() {
      const metodo = 'ObtenerAutomaticosPorUsuario';
      const parametros = '';
      return this.EnvioPeticion(metodo, parametros);
    }    

    ActualizarAutomaticosPorUsuario( automatico: AutomaticoPorUsuarioModel ) {
      const metodo = 'GuardarAutomatico';
      const parametros = automatico;
      return this.EnvioPeticion(metodo, parametros);
    }  
    
    EliminarAutomaticosPorUsuario(registro: registroModel) {
      const metodo = 'DesabilitarAutomatico';
      const parametros = registro;
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
