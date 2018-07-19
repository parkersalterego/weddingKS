import { Component, OnInit } from '@angular/core';
import { HelpService } from '../../services/help.service';

@Component({
  selector: 'app-help-messages',
  templateUrl: './help-messages.component.html',
  styleUrls: ['./help-messages.component.css']
})
export class HelpMessagesComponent implements OnInit {
  helpMessages;

  constructor(
              private helpService: HelpService
  ) { }

  ngOnInit() {
    this.getHelpMessages();
  }

  getHelpMessages() {
    this.helpService.getHelpRequests()
      .subscribe(data => {
        if (data !== null && data !== undefined) {
          console.log(data);
          this.helpMessages = data;
        } else {
          console.error('Failed to retreive messages');
        }
      });
  }

}
