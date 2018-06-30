import { Component, OnInit, AfterContentInit, Renderer2, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { AddGuestComponent } from '../add-guest/add-guest.component';
import { ManageGuestsComponent } from '../manage-guests/manage-guests.component';
import { AddPhotosComponent } from '../add-photos/add-photos.component';
import { RsvpsComponent } from '../rsvps/rsvps.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterContentInit {
  @ViewChild('selectedComponent', {read: ViewContainerRef}) selectedComponent;
  @ViewChild('componentContainer', {read: ViewContainerRef}) componentContainer;

  view = 'addGuest';

  constructor(
              private resolver: ComponentFactoryResolver,
              private renderer: Renderer2
  ) { }

  ngOnInit() {
  }

  ngAfterContentInit() {

    this.selectedComponent.createComponent(
      this.resolver.resolveComponentFactory(AddGuestComponent)
    );

  }

  onAddGuestClick() {
    this.selectedComponent.clear();

    this.selectedComponent.createComponent(
      this.resolver.resolveComponentFactory(AddGuestComponent)
    );

  }

  onManageGuestsClick() {
    this.selectedComponent.clear();

    this.selectedComponent.createComponent(
      this.resolver.resolveComponentFactory(ManageGuestsComponent)
    );

  }

  onAddPhotoClick() {
    this.selectedComponent.clear();

    this.selectedComponent.createComponent(
      this.resolver.resolveComponentFactory(AddPhotosComponent)
    );

  }

  onRsvpsClick() {
    this.selectedComponent.clear();

    this.selectedComponent.createComponent(
      this.resolver.resolveComponentFactory(RsvpsComponent)
    );
  }

}
