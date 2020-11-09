import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'utm-introduction-view',
  templateUrl: './introduction-view.component.html',
  styleUrls: ['./introduction-view.component.scss'],
})
export class IntroductionViewComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}

  onPlayClicked() {
    this.router.navigateByUrl('/map');
  }
}
