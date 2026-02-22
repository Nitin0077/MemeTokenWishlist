import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectForm } from '../project-form/project-form';
import { ProjectService } from '../../../services/project.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ProjectForm, FormsModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList implements OnInit {

  @Input() dateFrom: string = '';
@Input() dateTo: string = '';


  projects: any[] = [];

  // ✅ Return editing state
  editingReturnId: number | null = null;
  returnInputValue: number | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
  }

<<<<<<< HEAD
  loadProjects() {
=======
   loadProjects() {
>>>>>>> d28c676382d72af177dc7fedade710e7b8f2d397
  this.projectService.getAll().subscribe((projects: any[]) => {
    this.projects = projects; // ✅ plain array, no .record needed
  });
}

  add(project: any) {
    this.projectService.add(project).subscribe(() => {
      this.loadProjects();
    });
  }

  delete(id: string) {
    this.projectService.delete(id).subscribe(() => {
      this.loadProjects();
    });
  }

  
  

  // ✅ Toggle return input open/close per card
  toggleReturnEdit(p: any) {
    if (this.editingReturnId === p.id) {
      this.cancelReturn();
    } else {
      this.editingReturnId = p.id;
      this.returnInputValue = p.returnValue || null;
    }
  }

  // ✅ Save return value to json-server
  saveReturn(p: any) {
    p.returnValue = this.returnInputValue;
    this.projectService.update(p.id, p).subscribe(() => {
      this.loadProjects();
      this.cancelReturn();
    });
  }

  // ✅ Cancel return editing
  cancelReturn() {
    this.editingReturnId = null;
    this.returnInputValue = null;
  }

  searchText = '';
  riskFilter = '';

  filteredProjects() {
  return this.projects.filter(p => {

    // search filter
    const search = this.searchText?.toLowerCase() || '';
    const matchSearch = !search ||
      p.project?.toLowerCase().includes(search) ||
      p.ca?.toLowerCase().includes(search) ||
      p.chain?.toLowerCase().includes(search) ||
      p.handle?.toLowerCase().includes(search);

    // risk filter
    const matchRisk = !this.riskFilter || p.riskLevel === this.riskFilter;

    // date filter
    let matchDate = true;
    if (this.dateFrom || this.dateTo) {
      const created = new Date(p.createdAt).setHours(0, 0, 0, 0);
      if (this.dateFrom) {
        const from = new Date(this.dateFrom).setHours(0, 0, 0, 0);
        if (created < from) matchDate = false;
      }
      if (this.dateTo) {
        const to = new Date(this.dateTo).setHours(23, 59, 59, 999);
        if (created > to) matchDate = false;
      }
    }

    return matchSearch && matchRisk && matchDate;
  });
}

  showForm = false;

  toggleForm() {
    this.showForm = !this.showForm;
  }

  handleSave(project: any) {
    this.add(project);
    this.showForm = false;
  }

  copyCA(ca: string) {
    navigator.clipboard.writeText(ca);
  }

  openGMGN(ca: string, chain: string) {
    console.log('Opening GMGN for CA:', ca, 'on chain:', chain);
  if (!ca) return;

  const chainMap: { [key: string]: string } = {
    'Solana':   'sol',
    'Ethereum': 'eth',
    'Base':     'base',
    'Arbitrum': 'arb',
    'BNB Chain':'bsc',
    'Sui':      'sui'
  };

  const chainKey = chainMap[chain] || 'sol'; // default to solana
  const url = `https://gmgn.ai/${chainKey}/token/${ca}`;
  window.open(url, '_blank');
}


editingProjectId: string | null = null;
editDraft: any = {};

toggleEditProject(p: any) {
  if (this.editingProjectId === p.id) {
    this.cancelEdit();
  } else {
    this.editingProjectId = p.id;
    this.editDraft = { ...p };
    this.editingReturnId = null;
  }
}

saveEdit(p: any) {
  this.projectService.update(p.id, this.editDraft).subscribe(() => {
    this.loadProjects();
    this.cancelEdit();
  });
}

cancelEdit() {
  this.editingProjectId = null;
  this.editDraft = {};
}

<<<<<<< HEAD


}
=======
}
>>>>>>> d28c676382d72af177dc7fedade710e7b8f2d397
