import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginModel } from '../models/login.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = 'https://apiinspecciondocumentos.olimpiait.com/api/Accounts';

  constructor(private http: HttpClient) { }

  login(login: LoginModel) {
    return this.http.post(
      `${this.url}/Login`,
      login
    ).pipe(
      map((resp) => {
        return 'true';
      })
    );
  }

  logout() {
    return this.http.post(
      `${this.url}/logout`,
      {},
      this.getHeaders()
    ).pipe(
      map(resp => {
        return resp;
      })
    );
  }

  getHeaders(): object {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return httpOptions;
  }

}


