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
export class HelpService {

  constructor(
              private http: Http,
              private jwtHelper: JwtHelper,
              private cookieService: CookieService,
  ) { }

  submitHelpForm(helpForm) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.api}/help`, helpForm, {headers: headers})
      .pipe(map(res => res.json()));
  }

  getHelpRequests() {
    const headers = new Headers();
    const token = this.cookieService.get('authToken');

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http.get(`${environment.api}/help`, {headers: headers})
      .pipe(map(res => res.json()));
  }

}
