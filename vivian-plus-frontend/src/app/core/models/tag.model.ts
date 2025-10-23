export interface Tag {
  id: number;
  user_id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
  tasks_count?: number;
}

export interface CreateTagRequest {
  name: string;
  color: string;
}

export interface UpdateTagRequest extends Partial<CreateTagRequest> {}