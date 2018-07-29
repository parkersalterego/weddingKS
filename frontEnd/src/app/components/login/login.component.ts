import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('flashMessage') flashMessage;
  @ViewChild('flashMessageContent') flashMessageContent;

  constructor(
              private authService: AuthService,
              private jwtHelper: JwtHelper,
              private cookieService: CookieService,
              private router: Router
  ) { }

  ngOnInit() {
  }
  onLoginSubmit(form: NgForm) {
    const value = form.value;

    this.authService.loginUser({email: value.email, password: value.password})
      .subscribe(data => {
        if (data !== undefined && data !== null) {
          this.cookieService.put('authToken', JSON.stringify(data.accessToken));
          this.authService.getUserById()
            .subscribe(user => {
              if (user !== undefined && user !== null) {
                this.authService.user = user;
                this.flashMessage.nativeElement.classList.add('alert-success');
                this.flashMessageContent.nativeElement.innerHTML = 'Logged In Successfully';
                setTimeout(() => {
                  this.flashMessage.nativeElement.classList.remove('alert-success');
                  this.flashMessageContent.nativeElement.innerHTML = '';
                }, 3000);
                setTimeout(() => {
                  this.router.navigate(['/']);
                }, 3000);
              }
            });
        }
      }, err => {
        this.flashMessage.nativeElement.classList.add('alert-danger');
        this.flashMessageContent.nativeElement.innerHTML = err._body.split('"')[1];
        this.flashMessageContent.nativeElement.style.fontSize = '1.5rem';
        setTimeout(() => {
          this.flashMessage.nativeElement.classList.remove('alert-danger');
          this.flashMessageContent.nativeElement.innerHTML = '';
          this.flashMessageContent.nativeElement.style.fontSize = '2rem';
        }, 3000);
      });
  }

}
