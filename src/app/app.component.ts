import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from './shared/loader/loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Loader],
  template: `<app-loader></app-loader><router-outlet></router-outlet>`,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {}
