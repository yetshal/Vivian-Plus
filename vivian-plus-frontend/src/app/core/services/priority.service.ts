import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Priority } from '../models/priority.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {
  private apiUrl = `${environment.apiUrl}/priorities`;

  constructor(private http: HttpClient) {}

  getPriorities(): Observable<ApiResponse<Priority[]>> {
    return this.http.get<ApiResponse<Priority[]>>(this.apiUrl);
  }
}