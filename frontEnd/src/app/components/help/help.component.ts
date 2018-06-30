import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { HelpService } from '../../services/help.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

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

    console.log(helpForm);

    this.helpService.submitHelpForm(helpForm)
      .subscribe(data => {
        if (data) {
          console.log(data);
          this.router.navigate(['/']);
        }
      });
  }

}
