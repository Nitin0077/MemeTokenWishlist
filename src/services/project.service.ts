import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface Project {
  id?: string;
  name: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {

  private api = 'https://memetokenwishlist-9.onrender.com/projects';

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }

  getAll() {
    return this.http.get<Project[]>(this.api).pipe(
      catchError(this.handleError)
    );
  }

  add(project: Project) {
    return this.http.post<Project>(this.api, project).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, project: Project) {
    return this.http.put<Project>(`${this.api}/${id}`, project).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.api}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
<<<<<<< HEAD


}
=======
}
>>>>>>> d28c676382d72af177dc7fedade710e7b8f2d397
