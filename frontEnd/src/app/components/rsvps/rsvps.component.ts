import { Component, OnInit } from '@angular/core';

import { RsvpService } from '../../services/rsvp.service';

@Component({
  selector: 'app-rsvps',
  templateUrl: './rsvps.component.html',
  styleUrls: ['./rsvps.component.css']
})
export class RsvpsComponent implements OnInit {
  rsvps;
  totalGuests = 0;
  totalUnderSix = 0;

  constructor(
              private rsvpService: RsvpService
  ) { }

  ngOnInit() {
    this.rsvpService.getRsvps()
    .subscribe(data => {
      if (data) {
        this.rsvps = data;

        data.forEach((rsvp) => {
          if (typeof(rsvp.totalGuests) === 'number' && typeof(rsvp.totalUnderSix) === 'number') {
            this.totalGuests = this.totalGuests + rsvp.totalAttending;
          this.totalUnderSix = this.totalUnderSix + rsvp.underSixAttending;
          } else {
            console.log(rsvp);
          }
        });
      }
    });
  }

}
