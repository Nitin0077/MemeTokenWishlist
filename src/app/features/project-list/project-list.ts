import { Component, OnInit } from '@angular/core';
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

  projects: any[] = [];

  // ✅ Return editing state
  editingReturnId: number | null = null;
  returnInputValue: number | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getAll().subscribe(data => {
      this.projects = data;
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

      const matchesSearch =
        p.project?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.ca?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.chain?.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesRisk =
        !this.riskFilter || p.riskLevel === this.riskFilter;

      return matchesSearch && matchesRisk;
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

}
