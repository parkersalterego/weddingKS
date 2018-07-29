import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { CookieService } from 'angular2-cookie/services/cookies.service';

import { User } from '../models/User';
import { JwtHelper } from 'angular2-jwt';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;

  constructor(
              private http: Http,
              private router: Router,
              private jwtHelper: JwtHelper,
              private cookieService: CookieService,
  ) { }

  registerUser(user: User) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.api}/users/register`, user, {headers: headers})
      .pipe(map(res => res.json()));
  }

  loginUser(user: User) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.api}/users/login`, user, {headers: headers})
    .pipe(map(res => res.json()));
  }

  getUserById() {
    const headers = new Headers();
    const token = this.cookieService.get('authToken');
    const id = this.jwtHelper.decodeToken(token).id;
    const authToken = token.split('"')[1];
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + authToken);
    return this.http.get(`${environment.api}/users/${id}`, {headers: headers})
      .pipe(map(res => res.json()));
  }

  getUserByToken() {
    const headers = new Headers();
    const token = this.cookieService.get('authToken');
    const authToken = token.split('"')[1];
    const id = this.jwtHelper.decodeToken(authToken).id;
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + authToken);
    return this.http.get(`${environment.api}/users/${id}`, {headers: headers})
      .pipe(map(res => res.json()));
  }

  resetPassword(data) {
    const headers = new Headers();
    const token = this.cookieService.get('authToken');
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.api}/users/reset-password`, data, {headers: headers})
      .pipe(map(res => res.json()));
  }

  tokenCheck() {

    if (this.user === undefined || this.user === null) {

      const authToken = this.cookieService.get('authToken').split('"')[1];

      if (authToken === null ||  authToken === undefined || this.jwtHelper.isTokenExpired(authToken)) {

        return false;

      } else {
        const headers = new Headers();
        const id = this.jwtHelper.decodeToken(authToken).id;

        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + authToken);

        return this.http.get(`${environment.api}/users/${id}`, {headers: headers})
          .pipe(map(res => {

            if (res.json() === undefined || res.json() === null) {

              return false;

            } else {

              this.user = res.json();
              return true;

            }

          }));
      }
    } else {

      return true;

    }

  }

}
