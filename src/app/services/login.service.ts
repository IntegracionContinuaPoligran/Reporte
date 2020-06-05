import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginModel } from '../models/login.model';
import { TokenStorageService } from './token-storage.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private headers = { Authorization: '' };
  private controlador = 'login';

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router) { }


  login = (login: LoginModel) => {
    const metodo = 'authenticate';
    return this.EnvioPeticion(metodo, login);
  }

  EnvioPeticion(metodo: string, parametros: LoginModel) {
    this.obtenerToken();
    const headers = this.headers;
    const url = `${this.tokenStorage.ObtenerURL()}/${this.controlador}/${metodo}`;

    return this.http.post(url, parametros)
      .pipe(
        map((resp) => {
          const respJson = typeof (resp) == 'object' ? resp : JSON.parse(resp);
          if (respJson.estado) {
            this.guardarToken(respJson.mensaje1, parametros);
          }
          return respJson;
        })
      );
  }

  obtenerToken() {
    this.tokenStorage.select$()
      .subscribe(resp => {
        let token: string;
        if (resp === '' || resp == null || resp === undefined) {
          token = this.tokenStorage.ObtenerCookie()
        } else {
          token = resp
        }

        if (token === '' || token == null || token === undefined) {
          this.router.navigateByUrl('/login')
        } else {
          this.headers.Authorization = 'Bearer ' + token;
        }
      });
  }


  guardarToken = (idToken: string, login: LoginModel) => this.tokenStorage.dispatch(idToken, login);
  
  obtenerParametros = () => this.tokenStorage.ObtenerParametros();
  
}
