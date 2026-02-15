import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JwtStorageService {

  private key = 'crypto_projects_jwt';

  private encode(data: any): string {
    return btoa(JSON.stringify(data)); // simple JWT-like encoding
  }

  private decode(token: string): any {
    return JSON.parse(atob(token));
  }

  getProjects() {
    const token = localStorage.getItem(this.key);
    return token ? this.decode(token) : [];
  }

  saveProjects(projects: any[]) {
    const token = this.encode(projects);
    localStorage.setItem(this.key, token);
  }
}
