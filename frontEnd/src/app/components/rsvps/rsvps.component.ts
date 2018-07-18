import { Component, OnInit } from '@angular/core';

import { RsvpService } from '../../services/rsvp.service';

@Component({
  selector: 'app-rsvps',
  templateUrl: './rsvps.component.html',
  styleUrls: ['./rsvps.component.css']
})
export class RsvpsComponent implements OnInit {
  rsvps;

  constructor(
              private rsvpService: RsvpService
  ) { }

  ngOnInit() {
    this.rsvpService.getRsvps()
    .subscribe(data => {
      if (data) {
        this.rsvps = data;
        console.log(this.rsvps);
      }
    });
  }

}
