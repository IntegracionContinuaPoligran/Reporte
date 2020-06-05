import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { LoginModel } from '../models/login.model';



@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  private llave = 'dWdvjovACPYoQx6teXTt';
  private url = 'http://localhost:53313/api';
  private token = '';
  private token$ = new BehaviorSubject<string>('');

  constructor() { }

  public select$ = () => this.token$.asObservable();
  public dispatch( token, login: LoginModel) {

    sessionStorage.clear();
    sessionStorage.setItem('parametros', CryptoJS.AES.encrypt(JSON.stringify(login), this.llave).toString());
    sessionStorage.setItem('cookie', CryptoJS.AES.encrypt(token, this.llave).toString());

    this.token = token;
    this.token$.next(this.token);
  }

  guardarRutas(rutas) {
    sessionStorage.removeItem('nav');
    sessionStorage.setItem('nav', CryptoJS.AES.encrypt(JSON.stringify(rutas), this.llave).toString());
  }

  guardarMenu(menu) {
    sessionStorage.removeItem('url');
    sessionStorage.setItem('url', CryptoJS.AES.encrypt(JSON.stringify(menu), this.llave).toString());
  }

  obtenerMenu() {
    const rutas = JSON.parse(CryptoJS.AES.decrypt(sessionStorage.getItem('url'),this.llave).toString(CryptoJS.enc.Utf8));
    return rutas; 
  }

  obtenerRutas() {
    const rutas = JSON.parse(CryptoJS.AES.decrypt(sessionStorage.getItem('nav'),this.llave).toString(CryptoJS.enc.Utf8));
    return rutas; 
  }

  ObtenerParametros() {
    const login = JSON.parse(CryptoJS.AES.decrypt(sessionStorage.getItem('parametros'),this.llave).toString(CryptoJS.enc.Utf8));
    return login;
  }

  ObtenerCookie() {
    return  CryptoJS.AES.decrypt(sessionStorage.getItem('cookie') == null ? '' : sessionStorage.getItem('cookie')  ,this.llave).toString(CryptoJS.enc.Utf8);    
  }

  public ObtenerURL(){
   return this.url;
  }
}
