import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RsvpComponent implements OnInit {

  constructor(
              private authService: AuthService
  ) { }

  ngOnInit() {
    console.log(this.authService.user);
  }

}
