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
export class RsvpService {

  constructor(
              private http: Http,
              private jwtHelper: JwtHelper,
              private cookieService: CookieService,
  ) { }

  submitRsvp(rsvp) {
    console.log(rsvp);
    const token = this.cookieService.get('authToken');
    const authToken = token.split('"')[1];
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + authToken);
    return this.http.post(`${environment.api}/rsvp`, rsvp, {headers: headers})
      .pipe(map(res => res.json()));
  }

  getRsvps() {
    const authToken = this.cookieService.get('authToken').split('"')[1];
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + authToken);
    return this.http.get(`${environment.api}/rsvp`, {headers: headers})
      .pipe(map(res => res.json()));
  }
}
