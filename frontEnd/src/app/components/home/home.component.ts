import { Component, OnInit, AfterViewInit, ViewChild, Renderer } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('linkOne') l1;
  @ViewChild('linkTwo') l2;
  @ViewChild('linkThree') l3;
  @ViewChild('overlayOne') o1;
  @ViewChild('overlayTwo') o2;
  @ViewChild('overlayThree') o3;

  constructor(private renderer: Renderer) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const links = [this.l1, this.l2, this.l3];
    const overlays = [this.o1, this.o2, this.o3];

    setTimeout(() => {
      this.o1.nativeElement.classList.add('slide-up');
    }, 1000);

    setTimeout(() => {
      this.o2.nativeElement.classList.add('slide-up');
    }, 1500);

    setTimeout(() => {
      this.o3.nativeElement.classList.add('slide-up');
    }, 2000);

    setTimeout(() => {
      this.o3.nativeElement.classList.remove('slide-up');
      this.o1.nativeElement.classList.add('slow-slide-down');
    }, 2500);

    setTimeout(() => {
      this.o2.nativeElement.classList.remove('slide-up');
      this.o2.nativeElement.classList.add('slow-slide-down');
    }, 2500);

    setTimeout(() => {
      this.o1.nativeElement.classList.remove('slide-up');
      this.o3.nativeElement.classList.add('slow-slide-down');
    }, 2500);

    overlays.forEach((overlay) => {
      overlay.nativeElement.style.transition = 'all .3s';
    });

    links.map((link, i) => {
      link.nativeElement.addEventListener('mouseenter', () => {
        overlays.forEach((overlay) => {
         if (
           overlay.nativeElement.classList.contains('slide-up') ||
           overlay.nativeElement.classList.contains('slow-slide-down')
          ) {
          overlay.nativeElement.classList.remove('slide-up');
          overlay.nativeElement.classList.remove('slow-slide-down');
         }
        });
        overlays[i].nativeElement.classList.add('slide-up');
        overlays[i].nativeElement.classList.remove('slide-down');
      });

      overlays[i].nativeElement.addEventListener('mouseleave', () => {
        overlays[i].nativeElement.classList.add('slide-down');
        overlays[i].nativeElement.classList.remove('slide-up');
      });
    });
  }

}
