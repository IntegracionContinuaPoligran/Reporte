import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import { LoginModel } from '../models/login.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { promise } from 'protractor';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private headers = {Authorization: ''};
  private controlador = 'login';

  constructor(
    private http: HttpClient,
     private tokenStorage: TokenStorageService,
     private router: Router) { }

  

  login(login: LoginModel) {     
    const metodo = 'authenticate';
    const parametros = login;
    return this.EnvioPeticion(metodo, parametros);

  }  

  private guardarToken( idToken: string, login: LoginModel ) {

      this.tokenStorage.dispatch(idToken, login);
  }

  EnvioPeticion(metodo: string, parametros) {
    this.obtenerToken();
    const headers = this.headers;
    const url = `${this.tokenStorage.ObtenerURL()}/${this.controlador}/${metodo}`;

    return this.http.post<any>(url, parametros)
      .pipe(
        map((resp) => {
          const respJson = typeof(resp) == 'object' ?  resp : JSON.parse(resp);
          if ( respJson.estado){
            this.guardarToken( respJson.mensaje1, parametros);
          } 
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
