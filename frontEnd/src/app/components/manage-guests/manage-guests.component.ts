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
    const guest = this.guests[i];
    if (confirm(`Are You sure you would like to delete ${guest.firstName.charAt(0).toUpperCase() + guest.firstName.slice(1)} ${guest.lastName.charAt(0).toUpperCase() + guest.lastName.slice(1)}`)) {
    this.guestService.deleteGuest(guest._id)
      .subscribe(data => {
        console.log(data);
      });

    this.guests.splice(i, 1);
    }
  }

  onSendInvitationClick(i) {
    this.guests[i].sendInvitation === true ? this.guests[i].sendInvitation = false : this.guests[i].sendInvitation = true;

  }

  onRsvpClick(i) {
    this.guests[i].rsvp === true ? this.guests[i].rsvp = false : this.guests[i].rsvp = true;

  }

  onSaveClick(i) {
    const guest = this.guests[i];
    this.guestService.updateGuest(guest)
      .subscribe(data => {
        console.log(data);
      });
  }

}
