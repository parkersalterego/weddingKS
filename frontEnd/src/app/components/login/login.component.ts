import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { JwtHelper } from 'angular2-jwt';
import { CookieService } from 'angular2-cookie/services/cookies.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
              private authService: AuthService,
              private jwtHelper: JwtHelper,
              private cookieService: CookieService ,
              private router: Router
  ) { }

  ngOnInit() {
  }
  onLoginSubmit(form: NgForm) {
    const value = form.value;

    console.log({
      email: value.email,
      password: value.password
    });

    this.authService.loginUser({email: value.email, password: value.password})
      .subscribe(data => {
        if (data !== undefined && data !== null) {
          this.cookieService.put('authToken', JSON.stringify(data.accessToken));
          this.authService.getUserById(this.jwtHelper.decodeToken(data.accessToken).id)
            .subscribe(user => {
              if (user !== undefined && user !== null) {
                this.authService.user = user;
                this.router.navigate(['/']);
              }
            });
        }
      });
  }

}
