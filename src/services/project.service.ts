import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProjectService {

  private api = 'http://localhost:3000/projects';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.api);
  }

  add(project: any) {
    return this.http.post(this.api, project);
  }

  update(id: string, project: any) {
    return this.http.put(`${this.api}/${id}`, project);
  }

  delete(id: string) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
