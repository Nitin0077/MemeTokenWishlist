import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ProjectList } from './features/project-list/project-list';
import { ProjectService } from '../services/project.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ProjectList,FormsModule,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'crypto-ca-manager';

  @ViewChild('projectList') projectList!: ProjectList;
  @ViewChild('csvInput') csvInput!: ElementRef;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }

  // ─── CLOCK ────────────────────────────────────────────
  updateClock() {
    const now = new Date();
    const timeEl = document.getElementById('navTime');
    const dateEl = document.getElementById('navDate');
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  // ─── WIN RATIO ────────────────────────────────────────
  get projects(): any[] {
    return this.projectList?.projects || [];
  }

  get totalProjects(): number {
    return this.projects.length;
  }

  get totalWithReturn(): number {
    return this.projects.filter(p => p.returnValue).length;
  }

  get totalPending(): number {
    return this.projects.filter(p => !p.returnValue).length;
  }

  get wins(): number {
    return this.projects.filter(p => p.returnValue && p.returnValue > 1).length;
  }

  get losses(): number {
    return this.projects.filter(p => p.returnValue && p.returnValue <= 1).length;
  }

  get winRatio(): string {
    if (this.totalWithReturn === 0) return '0%';
    return ((this.wins / this.totalWithReturn) * 100).toFixed(0) + '%';
  }

  get winRatioRaw(): number {
    if (this.totalWithReturn === 0) return 0;
    return (this.wins / this.totalWithReturn) * 100;
  }

  get bestReturn(): string {
    const returns = this.projects
      .filter(p => p.returnValue)
      .map(p => p.returnValue);
    if (!returns.length) return '—';
    return Math.max(...returns) + 'x';
  }

  // ─── EXPORT CSV ───────────────────────────────────────
  exportToCSV() {
  this.projectService.getAll().subscribe((projects: any[]) => {

    if (!projects.length) {
      alert('No projects to export.');
      return;
    }

    const headers = [
      'Project', 'Handle', 'CA', 'Chain', 'Category',
      'Narrative Tag', 'Use Case', 'Market Cap', 'Rating',
      'Risk Level', 'Return (x)', 'Created At'
    ];

    const rows = projects.map((p: any) => [
      p.project      || '',
      p.handle       || '',
      p.ca           || '',
      p.chain        || '',
      p.category     || '',
      p.narrativeTag || '',
      p.useCase      || '',
      p.marketCap    || '',
      p.rating       || '',
      p.riskLevel    || '',
      p.returnValue  || '',
      p.createdAt ? new Date(p.createdAt).toLocaleString() : ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map((cell: any) =>
        `"${String(cell).replace(/"/g, '""')}"`
      ).join(','))
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

  // ─── IMPORT CSV ───────────────────────────────────────
  triggerImport() {
    this.csvInput.nativeElement.click();
  }

 importFromCSV(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e: any) => {
    const text = e.target.result as string;
    const lines = text.trim().split('\n');

    const imported = lines.slice(1).map(line => {
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const clean = values.map((v: string) => v.replace(/"/g, '').trim());

      // ✅ use date from CSV (index 11), fallback to now only if missing
      const csvDate = clean[11] ? new Date(clean[11]) : null;
      const createdAt = csvDate && !isNaN(csvDate.getTime())
        ? csvDate.toISOString()
        : new Date().toISOString();

      return {
        id:           crypto.randomUUID(),
        project:      clean[0]  || '',
        handle:       clean[1]  || '',
        ca:           clean[2]  || '',
        chain:        clean[3]  || '',
        category:     clean[4]  || '',
        narrativeTag: clean[5]  || '',
        useCase:      clean[6]  || '',
        marketCap:    clean[7]  || '',
        rating:       clean[8]  || '',
        riskLevel:    clean[9]  || 'Low',
        returnValue:  clean[10] ? parseFloat(clean[10]) : null,
        createdAt:    createdAt  // ✅ preserved from CSV
      };
    }).filter((p: any) => p.project);

    if (!imported.length) {
      alert('No valid projects found in CSV.');
      return;
    }

    const confirmed = confirm(`Import ${imported.length} projects?`);
    if (!confirmed) return;

    let count = 0;
    imported.forEach((project: any) => {
      this.projectService.add(project).subscribe(() => {
        count++;
        if (count === imported.length) {
          this.projectList.loadProjects();
          alert(`✅ ${imported.length} projects imported successfully!`);
        }
      });
    });

    this.csvInput.nativeElement.value = '';
  };

  reader.readAsText(file);
}


  // Date filter
dateFrom: string = '';
dateTo: string = '';
activeDatePreset: string = 'all';

setDatePreset(preset: string) {
  this.activeDatePreset = preset;
  const now = new Date();

  if (preset === 'all') {
    this.dateFrom = '';
    this.dateTo = '';
  } else if (preset === 'today') {
    this.dateFrom = now.toISOString().slice(0, 10);
    this.dateTo   = now.toISOString().slice(0, 10);
  } else if (preset === '7d') {
    const from = new Date(now);
    from.setDate(now.getDate() - 7);
    this.dateFrom = from.toISOString().slice(0, 10);
    this.dateTo   = now.toISOString().slice(0, 10);
  } else if (preset === '30d') {
    const from = new Date(now);
    from.setDate(now.getDate() - 30);
    this.dateFrom = from.toISOString().slice(0, 10);
    this.dateTo   = now.toISOString().slice(0, 10);
  } else if (preset === '90d') {
    const from = new Date(now);
    from.setDate(now.getDate() - 90);
    this.dateFrom = from.toISOString().slice(0, 10);
    this.dateTo   = now.toISOString().slice(0, 10);
  }
}

onCustomDateChange() {
  this.activeDatePreset = 'custom';
}

clearDateFilter() {
  this.dateFrom = '';
  this.dateTo = '';
  this.activeDatePreset = 'all';
}




}
