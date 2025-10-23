import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tag, CreateTagRequest, UpdateTagRequest } from '../models/tag.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = `${environment.apiUrl}/tags`;

  constructor(private http: HttpClient) {}

  getTags(): Observable<ApiResponse<Tag[]>> {
    return this.http.get<ApiResponse<Tag[]>>(this.apiUrl);
  }

  getTag(id: number): Observable<ApiResponse<Tag>> {
    return this.http.get<ApiResponse<Tag>>(`${this.apiUrl}/${id}`);
  }

  createTag(data: CreateTagRequest): Observable<ApiResponse<Tag>> {
    return this.http.post<ApiResponse<Tag>>(this.apiUrl, data);
  }

  updateTag(id: number, data: UpdateTagRequest): Observable<ApiResponse<Tag>> {
    return this.http.put<ApiResponse<Tag>>(`${this.apiUrl}/${id}`, data);
  }

  deleteTag(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }
}