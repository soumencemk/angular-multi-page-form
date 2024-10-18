import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { CommonModule } from '@angular/common';

import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class ProgressBarComponent implements OnInit {
  progress: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const routeProgressMap: { [key: string]: number } = {
      'step-one': 20,
      'step-two': 40,
      'step-three': 60,
      'step-four': 80,
      confirmation: 100,
      completion: 100,
    };

    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        ),
        map((event: NavigationEnd) => {
          const currentRoute = event.urlAfterRedirects.split('/')[1];
          return routeProgressMap[currentRoute] || 0;
        })
      )
      .subscribe((progressValue) => {
        this.progress = progressValue;
      });
  }
}
