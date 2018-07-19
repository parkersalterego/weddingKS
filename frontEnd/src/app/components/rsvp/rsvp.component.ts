import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { RsvpService } from '../../services/rsvp.service';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RsvpComponent implements OnInit {

  constructor(
              private authService: AuthService,
              private rsvpService: RsvpService,
              private router: Router
  ) { }

  ngOnInit() {
  }

  onFormSubmit(form, rsvpService) {
    const value = form.value;

    this.authService.getUserByToken()
      .subscribe(data => {

        const rsvp = {
          attending: value.attending === '' ? false : true,
          comments: value.comments,
          firstName: data.firstName,
          lastName: data.lastName,
          userId: data._id
        };

        this.rsvpService.submitRsvp(rsvp)
          .subscribe(newRsvp => {
            if (newRsvp !== null && newRsvp !== undefined) {
              this.router.navigate(['/']);
            }
          });
      });
  }

}
