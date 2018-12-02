import {Component} from '@angular/core';

@Component({
  selector: 'app-home',
  template: `<h3>Home</h3>`
})

export class HomeComponent {
  constructor() {
    console.log('hostname:', window.location.hostname);
  }
}
