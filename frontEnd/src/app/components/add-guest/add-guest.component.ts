import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';

import { GuestService } from '../../services/guest.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-add-guest',
  templateUrl: './add-guest.component.html',
  styleUrls: ['./add-guest.component.css']
})
export class AddGuestComponent implements OnInit {
@ViewChild('addedGuests') addedGuests;
@ViewChild('firstName') firstName;
@ViewChild('lastName') lastName;
@ViewChild('checkBox') checkBox;
@ViewChild('addAbove')  addAbove;

invitation = [];
guests = [];

  constructor(
              private guestService: GuestService,
              private renderer: Renderer2
  ) { }

  ngOnInit() {
  }

  onGuestAdd(form) {

    if (form.value.firstName !== '' && form.value.lastName !== '') {
      const guest = {
        firstName: form.value.firstName.toLowerCase(),
        lastName: form.value.lastName.toLowerCase(),
        sendInvitation: false
      };

      this.checkBox.nativeElement.checked ? guest.sendInvitation = true : guest.sendInvitation = false;

      this.invitation.push(guest);

      const addedGuest = this.renderer.createElement('div');
      const firstName = this.renderer.createElement('h2');
      const lastName = this.renderer.createElement('h2');

      this.renderer.addClass(addedGuest, 'added-guest');
      this.renderer.addClass(firstName, 'ag-first-name');
      this.renderer.addClass(lastName, 'ag-last-name');


      firstName.innerHTML = guest.firstName.charAt(0).toUpperCase() + guest.firstName.slice(1);
      lastName.innerHTML = guest.lastName.charAt(0).toUpperCase() + guest.lastName.slice(1);


      this.renderer.appendChild(addedGuest, firstName);
      this.renderer.appendChild(addedGuest, lastName);

      if (guest.sendInvitation === true) {
        const sendInvitation = this.renderer.createElement('h2');
        this.renderer.addClass(sendInvitation, 'ag-send-invitation');
        sendInvitation.innerHTML = '<i class="fas fa-check"></i>';
        this.renderer.appendChild(addedGuest, sendInvitation);
      }

      this.renderer.appendChild(this.addedGuests.nativeElement, addedGuest);
      this.firstName.nativeElement.value = '';
      this.lastName.nativeElement.value = '';
      this.checkBox.nativeElement.checked = '';

      this.guestService.addGuest(guest)
        .subscribe(data => {
          console.log(data);
        });
    }
  }

}
