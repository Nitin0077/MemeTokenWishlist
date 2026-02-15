import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProjectList } from './features/project-list/project-list';

@Component({
  selector: 'app-root',
  imports: [ProjectList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'crypto-ca-manager';
}
  