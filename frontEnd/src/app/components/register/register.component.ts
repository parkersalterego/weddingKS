import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

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
          console.log(data);
          this.router.navigate(['/login']);
        }
      });
  }

}
