import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { RsvpService } from '../../services/rsvp.service';
import { GuestService } from '../../services/guest.service';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RsvpComponent implements OnInit {
  @ViewChild('flashMessage') flashMessage;
  @ViewChild('flashMessageContent') flashMessageContent;
  @ViewChild('attendingText') attendingText;
  @ViewChild('checkBox') checkBox;
  @ViewChild('attending') attending;
  @ViewChild('underSix') underSix;
  @ViewChild('comments') comments;

  edit: Boolean;
  guest;
  rsvp;
  totalAttending: Number;
  underSixAttending: Number;

  constructor(
              private authService: AuthService,
              private rsvpService: RsvpService,
              private guestService: GuestService,
              private router: Router
  ) { }

  ngOnInit() {
    this.getGuest();
  }

  getGuest() {
    this.guestService.getGuestByName({
      'firstName' : this.authService.user.firstName,
      'lastName' : this.authService.user.lastName
    }).subscribe(data => {
      console.log(data);
      this.guest = data;
      this.guest.rsvp ? this.edit = true : this.edit = false;
      console.log(this.edit);
      this.edit === false ? this.comments.nativeElement.value = '' :  this.getRsvp();
    });

  }

  getRsvp() {
    this.rsvpService.getRsvp()
      .subscribe(data => {

        this.setUpFormForEdit(data);
      });
  }

  setUpFormForEdit(rsvp) {
    rsvp.attending
      ? this.attendingText.nativeElement.innerHTML = 'Yes'
      : this.attendingText.nativeElement.innerHTML = 'No';
    this.checkBox.nativeElement.checked = rsvp.attending;
    this.comments.nativeElement.value = rsvp.comments;
    this.attending.nativeElement.value = rsvp.totalAttending;
    this.underSix.nativeElement.value = rsvp.underSixAttending;
  }

  onFormSubmit(f) {

    const value = f.value;

    this.checkBox.nativeElement.checked
      ? (this.totalAttending = this.attending.nativeElement.value === '' ? 0 : this.attending.nativeElement.value,
        this.underSixAttending = this.underSix.nativeElement.value === '' ? 0 : this.underSix.nativeElement.value)
      : (this.totalAttending = 0,
        this.underSixAttending = 0);

    const rsvp = {
      attending: this.checkBox.nativeElement.checked === '' ? false : true,
      comments: this.comments.nativeElement.value,
      firstName: this. authService.user.firstName,
      lastName: this.authService.user.lastName,
      totalAttending: this.totalAttending,
      underSixAttending: this.underSixAttending,
      userId: this.authService.user._id
    };

    if (rsvp.totalAttending < 0 || rsvp.underSixAttending < 0) {
      this.flashMessage.nativeElement.classList.add('alert-danger');
      this.flashMessageContent.nativeElement.innerHTML = 'Attending counts may not be negative numbers';
      this.flashMessageContent.nativeElement.style.fontSize = '1.25rem';
      setTimeout(() => {
        this.flashMessage.nativeElement.classList.remove('alert-danger');
        this.flashMessageContent.nativeElement.innerHTML = '';
        this.flashMessageContent.nativeElement.style.fontSize = '2rem';
      }, 3000);
    } else if (rsvp.attending && rsvp.totalAttending <= 0) {
      this.flashMessage.nativeElement.classList.add('alert-danger');
      this.flashMessageContent.nativeElement.innerHTML = 'Please fill out the attending counts below';
      this.flashMessageContent.nativeElement.style.fontSize = '1.25rem';
      setTimeout(() => {
        this.flashMessage.nativeElement.classList.remove('alert-danger');
        this.flashMessageContent.nativeElement.innerHTML = '';
        this.flashMessageContent.nativeElement.style.fontSize = '2rem';
      }, 3000);
    } else {
      this.edit === true ? this.editRsvpSubmit(rsvp) : this.firstSubmit(rsvp);
    }
  }

  editRsvpSubmit(rsvp) {
    this.rsvpService.editRsvp(rsvp)
      .subscribe(data => {
        this.flashMessage.nativeElement.classList.add('alert-success');
        this.flashMessageContent.nativeElement.innerHTML = 'Rsvp Edited';
        setTimeout(() => {
          this.flashMessage.nativeElement.classList.remove('alert-success');
          this.flashMessageContent.nativeElement.innerHTML = '';
        }, 3000);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      });
  }

  firstSubmit(rsvp) {
    this.rsvpService.submitRsvp(rsvp)
      .subscribe(data => {
        this.flashMessage.nativeElement.classList.add('alert-success');
        this.flashMessageContent.nativeElement.innerHTML = 'Rsvp Submitted';
        setTimeout(() => {
          this.flashMessage.nativeElement.classList.remove('alert-success');
          this.flashMessageContent.nativeElement.innerHTML = '';
        }, 3000);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      });
  }

  updateAttendingStatus() {
    if (this.checkBox.nativeElement.checked) {
      this.attendingText.nativeElement.innerHTML = 'Yes';
    } else {
      this.attendingText.nativeElement.innerHTML = 'No';
    }
  }

}
