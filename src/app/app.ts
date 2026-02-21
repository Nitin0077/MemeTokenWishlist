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

  // In app.component.ts ngOnInit or anywhere suitable
updateClock() {
  const now = new Date();
  const timeEl = document.getElementById('navTime');
  const dateEl = document.getElementById('navDate');
  if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

ngOnInit() {
  this.updateClock();
  setInterval(() => this.updateClock(), 1000);
}
}
  