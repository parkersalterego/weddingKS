import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { HelpService } from '../../services/help.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  @ViewChild('flashMessage') flashMessage;
  @ViewChild('flashMessageContent') flashMessageContent;

  constructor(
              private helpService: HelpService,
              private router: Router
  ) { }

  ngOnInit() {
  }

  onFormSubmit(form: NgForm) {
    const value = form.value;

    const helpForm = {
      name: value.name,
      email: value.email,
      comments: value.comments
    };

    if (helpForm.name === '' || helpForm.email === '' || helpForm.comments === '') {
      this.flashMessage.nativeElement.classList.add('alert-danger');
      this.flashMessageContent.nativeElement.innerHTML = 'Please fill out all fields below';
      this.flashMessageContent.nativeElement.style.fontSize = '1.5rem';
      setTimeout(() => {
        this.flashMessage.nativeElement.classList.remove('alert-danger');
        this.flashMessageContent.nativeElement.innerHTML = '';
        this.flashMessageContent.nativeElement.style.fontSize = '2rem';
      }, 3000);
    } else {
      this.helpService.submitHelpForm(helpForm)
      .subscribe(data => {
        if (data) {
          this.flashMessage.nativeElement.classList.add('alert-success');
          this.flashMessageContent.nativeElement.innerHTML = 'Help Message Submitted';
          setTimeout(() => {
            this.flashMessage.nativeElement.classList.remove('alert-success');
            this.flashMessageContent.nativeElement.innerHTML = '';
          }, 3000);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        }
      });
    }
  }

}
