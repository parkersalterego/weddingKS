import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { environment } from '../../environments/environment';

import { CookieService } from 'angular2-cookie/services/cookies.service';

import { JwtHelper } from 'angular2-jwt';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(
              private http: Http,
              private jwtHelper: JwtHelper,
              private cookieService: CookieService,
  ) { }

  addGuest(guest) {
    console.log(guest);
    const token = this.cookieService.get('authToken');
    const authToken = token.split('"')[1];
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + authToken);
    return this.http.post(`${environment.api}/guests/add`, guest, {headers: headers})
      .pipe(map(res => res.json()));
  }

  getGuests() {
    const token = this.cookieService.get('authToken');
    const authToken = token.split('"')[1];
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + authToken);
    return this.http.get(`${environment.api}/guests`, {headers: headers})
      .pipe(map(res => res.json()));
  }


  deleteGuest(id) {
    const token = this.cookieService.get('authToken');
    const authToken = token.split('"')[1];
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + authToken);
    return this.http.delete(`${environment.api}/guests/${id}`, {headers: headers})
      .pipe(map(res => res.json()));
  }

}
