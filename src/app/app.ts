import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProjectList } from './features/project-list/project-list';
import { ProjectService } from '../services/project.service';

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


constructor(private projectService: ProjectService) {}

ngOnInit() {
  this.updateClock();
  setInterval(() => this.updateClock(), 1000);
}


 exportToCSV() {
    this.projectService.getAll().subscribe(projects => {

      const headers = [
        'Project', 'Handle', 'CA', 'Chain', 'Category',
        'Narrative Tag', 'Use Case', 'Market Cap', 'Rating',
        'Risk Level', 'Return (x)', 'Created At'
      ];

      const rows = projects.map((p: any) => [
        p.project || '',
        p.handle || '',
        p.ca || '',
        p.chain || '',
        p.category || '',
        p.narrativeTag || '',
        p.useCase || '',
        p.marketCap || '',
        p.rating || '',
        p.riskLevel || '',
        p.returnValue || '',
        p.createdAt ? new Date(p.createdAt).toLocaleString() : ''
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cryptodesk-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }
}
  
