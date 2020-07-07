import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { registroModel } from '../models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private headers = {Authorization:''}; 
  private controlador: string = 'reporte';

  constructor(
    private http: HttpClient, 
    private tokenStorage: TokenStorageService,    
    private router: Router) { }

  ObtenerReporteDedicacionPorProyecto(registro: registroModel) {
      var metodo = 'DedicacionPorproyecto';
      var parametros = registro;
       return this.EnvioPeticion(metodo, parametros);
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
