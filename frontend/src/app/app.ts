import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.html',

  template: '<router-outlet></router-outlet>',
  styleUrl: './app.css'
})
export class App {
 
    title = 'mean-todo-app';
}
