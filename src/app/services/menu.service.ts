import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { registroModel } from '../models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private headers = {Authorization: ''};
  private controlador = 'home';

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router) { }


  menuUsuario() {
    const metodo = 'ObtenerMenu';
    const parametrosSesion = this.obtenerParametros();
    const re = new registroModel();
    re.parametro1 = parametrosSesion.usuario;
    return this.EnvioPeticion(metodo, re)
    .pipe(
      map((resp) => {
        if (resp.estado) {
          const menu = typeof (resp.mensaje1) === 'object' ? resp.mensaje1 : JSON.parse(resp.mensaje1);
          this.tokenStorage.guardarMenu(menu);
          return true;
        }
      })
    )
  }

  obtenerNombreUsuario() {
    const metodo = 'ObtenerNombreUsuario';
    const parametrosSesion = this.obtenerParametros();
    const re = new registroModel();
    re.parametro1 = parametrosSesion.usuario;
   return this.EnvioPeticion(metodo, re);
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
       const token =  resp === '' || resp == null || resp === undefined ?  this.tokenStorage.ObtenerCookie() : resp;
       token === '' || token == null || token === undefined? this.router.navigateByUrl('/login') :
       this.headers.Authorization =  'Bearer ' + token;
      });
  }

  obtenerParametros() {
     return this.tokenStorage.ObtenerParametros();
  }

}
