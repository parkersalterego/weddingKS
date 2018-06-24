import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { RsvpComponent } from '../components/rsvp/rsvp.component';
import { DetailsComponent } from '../components/details/details.component';
import { GalleryComponent } from '../components/gallery/gallery.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'rsvp',
    component: RsvpComponent
  },
  {
    path: 'details',
    component: DetailsComponent
  },
  {
    path: 'gallery',
    component: GalleryComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  providers: []
})
export class RoutingModule { }
