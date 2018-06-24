import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onRegisterSubmit(form) {
    const value = form.value;

    console.log({
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      password: value.password
    });
  }

}
