import { Component, OnInit } from '@angular/core';

import { GuestService } from '../../services/guest.service';

@Component({
  selector: 'app-manage-guests',
  templateUrl: './manage-guests.component.html',
  styleUrls: ['./manage-guests.component.css']
})
export class ManageGuestsComponent implements OnInit {
  guests =[];

  constructor(
              private guestService: GuestService
  ) { }

  ngOnInit() {
    this.guestService.getGuests()
      .subscribe(data => {
        data.forEach((guest) => {
          this.guests.push(guest);
          console.log(guest);
        });
      });
  }

  onDeleteClick(i) {
    console.log(this.guests[i]._id);
    this.guestService.deleteGuest(this.guests[i]._id)
      .subscribe(data => {
        console.log(data);
      });
  }

}
