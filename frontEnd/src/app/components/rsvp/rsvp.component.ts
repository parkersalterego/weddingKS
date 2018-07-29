import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { RsvpService } from '../../services/rsvp.service';

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
  user;
  guest;
  totalAttending: Number;
  underSixAttending: Number;

  constructor(
              private authService: AuthService,
              private rsvpService: RsvpService,
              private router: Router
  ) { }

  ngOnInit() {
    console.log(this.attending);
    this.user = this.authService.user;
    this.rsvpService.checkRsvp()
      .subscribe(data => {
        console.log(data);
        if (data === false) {
          this.edit = false;
        } else {
          this.edit = true;

          data.attending
          ? this.attendingText.nativeElement.innerHTML = 'Yes'
          : this.attendingText.nativeElement.innerHTML = 'No';
          this.checkBox.nativeElement.checked = data.attending;
          this.comments.nativeElement.value = data.comments;
          this.attending.nativeElement.value = data.totalAttending;
          this.underSix.nativeElement.value = data.underSixAttending;
        }
      });
  }

  onFormSubmit(form) {
    const value = form.value;

    if (this.checkBox.nativeElement.checked) {
      this.totalAttending = value.totalGuests === '' ? 0 : value.totalGuests;
      this.underSixAttending = value.under === '' ? 0 : value.under;
    } else {
      this.totalAttending = 0;
      this.underSixAttending = 0;
    }


    const rsvp = {
      attending: value.attending === '' ? false : true,
      comments: value.comments,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      totalAttending: this.totalAttending,
      underSixAttending: this.underSixAttending,
      userId: this.user._id
    };


    if (this.edit) {
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
        }, err => {
          this.flashMessage.nativeElement.classList.add('alert-danger');
          this.flashMessageContent.nativeElement.innerHTML = err._body.split('"')[1];
          this.flashMessageContent.nativeElement.style.fontSize = '1.5rem';
          setTimeout(() => {
            this.flashMessage.nativeElement.classList.remove('alert-danger');
            this.flashMessageContent.nativeElement.innerHTML = '';
            this.flashMessageContent.nativeElement.style.fontSize = '2rem';
          }, 3000);
        });
    } else {
      this.rsvpService.submitRsvp(rsvp)
        .subscribe(data => {
          this.flashMessage.nativeElement.classList.add('alert-success');
          this.flashMessageContent.nativeElement.innerHTML = 'Rsvp Submmitted';
          setTimeout(() => {
            this.flashMessage.nativeElement.classList.remove('alert-success');
            this.flashMessageContent.nativeElement.innerHTML = '';
          }, 3000);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        }, err => {
          this.flashMessage.nativeElement.classList.add('alert-danger');
          this.flashMessageContent.nativeElement.innerHTML = err._body.split('"')[1];
          this.flashMessageContent.nativeElement.style.fontSize = '1.5rem';
          setTimeout(() => {
            this.flashMessage.nativeElement.classList.remove('alert-danger');
            this.flashMessageContent.nativeElement.innerHTML = '';
            this.flashMessageContent.nativeElement.style.fontSize = '2rem';
          }, 3000);
        });
    }
  }

  submitRsvp(rsvp) {
    console.log(rsvp);
    this.rsvpService.submitRsvp(rsvp);
  }

  editRsvp(rsvp) {
    console.log('edit');
  }

  updateAttendingStatus() {
    if (this.checkBox.nativeElement.checked) {
      this.attendingText.nativeElement.innerHTML = 'Yes';
    } else {
      this.attendingText.nativeElement.innerHTML = 'No';
    }
  }

}
