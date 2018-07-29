import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('flashMessage') flashMessage;
  @ViewChild('flashMessageContent') flashMessageContent;

  constructor(
              private authService: AuthService,
              private router: Router,
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit(form) {
    const value = form.value;

    this.authService.registerUser({
      firstName: value.firstName.toLowerCase(),
      lastName: value.lastName.toLowerCase(),
      email: value.email,
      password: value.password
    })
      .subscribe(data => {
        if (data) {
          this.flashMessage.nativeElement.classList.add('alert-success');
            this.flashMessageContent.nativeElement.innerHTML = 'Account Created Successfully';
            setTimeout(() => {
              this.flashMessage.nativeElement.classList.remove('alert-success');
              this.flashMessageContent.nativeElement.innerHTML = '';
            }, 3000);
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
        }
      }, err => {
        console.log(err._body);
        this.flashMessage.nativeElement.classList.add('alert-danger');
            this.flashMessageContent.nativeElement.innerHTML = err._body;
            setTimeout(() => {
              this.flashMessage.nativeElement.classList.remove('alert-danger');
              this.flashMessageContent.nativeElement.innerHTML = '';
            }, 3000);
      });
  }

}
