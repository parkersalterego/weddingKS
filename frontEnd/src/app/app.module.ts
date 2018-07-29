import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RoutingModule } from './modules/routing.module';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RsvpComponent } from './components/rsvp/rsvp.component';
import { DetailsComponent } from './components/details/details.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { AdminComponent } from './components/admin/admin.component';
import { AddGuestComponent } from './components/add-guest/add-guest.component';
import { ManageGuestsComponent } from './components/manage-guests/manage-guests.component';
import { AddPhotosComponent } from './components/add-photos/add-photos.component';
import { GuestCountComponent } from './components/guest-count/guest-count.component';
import { HelpComponent } from './components/help/help.component';

import { JwtHelper} from 'angular2-jwt';

import { RsvpService } from './services/rsvp.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { AuthService } from './services/auth.service';
import { InvitationService } from './services/invitation.service';
import { GuestService } from './services/guest.service';
import { HelpService } from './services/help.service';
import { RsvpsComponent } from './components/rsvps/rsvps.component';
import { HelpMessagesComponent } from './components/help-messages/help-messages.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent,
    RsvpComponent,
    DetailsComponent,
    GalleryComponent,
    AdminComponent,
    AddGuestComponent,
    ManageGuestsComponent,
    AddPhotosComponent,
    GuestCountComponent,
    HelpComponent,
    RsvpsComponent,
    HelpMessagesComponent,
    PasswordResetComponent,
  ],
  entryComponents: [
    AddGuestComponent,
    ManageGuestsComponent,
    AddPhotosComponent,
    RsvpsComponent,
    HelpMessagesComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FormsModule,
    HttpModule,
  ],
  providers: [
    AuthService,
    InvitationService,
    GuestService,
    RsvpService,
    HelpService,
    CookieService,
    JwtHelper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
