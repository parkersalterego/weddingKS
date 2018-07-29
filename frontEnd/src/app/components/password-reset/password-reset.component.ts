import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  @ViewChild('flashMessage') flashMessage;
  @ViewChild('flashMessageContent') flashMessageContent;

  constructor(
              private authService: AuthService,
              private router: Router,
  ) { }

  ngOnInit() {
  }

  onFormSubmit(f) {
    const form = f.value;

    const reset = {
      email: form.email,
      password: form.password,
      repeatPassword: form.repeatPassword
    };

    if (reset.repeatPassword !== reset.password) {
      // this.flashMessagesService.show('Passwords must match', { cssClass: 'alert-danger', timeout: 3000 });
      this.flashMessage.nativeElement.classList.add('alert-danger');
      this.flashMessageContent.nativeElement.innerHTML = 'Passwords must match';
      setTimeout(() => {
        this.flashMessage.nativeElement.classList.remove('alert-danger');
        this.flashMessageContent.nativeElement.innerHTML = '';
      }, 3000);
    } else {
      this.authService.resetPassword({email: form.email, password: form.password})
        .subscribe(data => {
            // this.flashMessagesService.show('Password reset successfully', { cssClass: 'alert-success', timeout: 3000 });
            this.flashMessage.nativeElement.classList.add('alert-success');
            this.flashMessageContent.nativeElement.innerHTML = 'Reset Successfully';
            setTimeout(() => {
              this.flashMessage.nativeElement.classList.remove('alert-success');
              this.flashMessageContent.nativeElement.innerHTML = '';
            }, 3000);
            setTimeout(() => {
              this.router.navigate(['/login']);
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

}
