import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  location;
  navBarCount = 0;
  navItems = [];

  @ViewChild('barOne') barOne;
  @ViewChild('barTwo') barTwo;
  @ViewChild('barThree') barThree;
  @ViewChild('navBar') navBar;

  constructor(
              private authService: AuthService,
              private router: Router
  ) {
    this.location = router.url;
   }

  ngOnInit() {
    this.pushNavItems();
  }

  isAdmin() {
    if (this.authService.user === null || this.authService.user === undefined) {
      return false;
    } else {
      return this.authService.user.role === 'admin' ? true : false;
    }
  }

  onMenuClick() {
    if (this.navBarCount === 0 ) {
      this.navItems.forEach((item) => {
        item.nativeElement.classList.add('animate');
      });
      this.barOne.nativeElement.classList.add('white');
      this.barTwo.nativeElement.classList.add('white');
      this.barThree.nativeElement.classList.add('white');
      this.navBarCount++;
    } else if (this.navBarCount % 2 === 1) {
      this.navItems.forEach((item) => {
        item.nativeElement.classList.remove('animate');
        item.nativeElement.classList.add('animate-reverse');
      });
      this.barOne.nativeElement.classList.remove('white');
      this.barTwo.nativeElement.classList.remove('white');
      this.barThree.nativeElement.classList.remove('white');
      this.navBarCount++;
    } else {
      this.navItems.forEach((item) => {
        item.nativeElement.classList.add('animate');
        item.nativeElement.classList.remove('animate-reverse');
      });
      this.barOne.nativeElement.classList.add('white');
      this.barTwo.nativeElement.classList.add('white');
      this.barThree.nativeElement.classList.add('white');
      this.navBarCount--;
    }
  }

  onListItemClick() {
    this.navItems.forEach((item) => {
      item.nativeElement.classList.remove('animate');
      item.nativeElement.classList.add('animate-reverse');
    });
    this.navBarCount++;
  }

  pushNavItems() {
    this.navItems.push(this.barOne);
    this.navItems.push(this.barTwo);
    this.navItems.push(this.barThree);
    this.navItems.push(this.navBar);
  }


}
