import { Priority } from './priority.model';
import { Tag } from './tag.model';
import { User } from './user.model';

export interface Task {
  id: number;
  user_id: number;
  priority_id?: number;
  title: string;
  description?: string;
  is_completed: boolean;
  completed_at?: string;
  due_date?: string;
  reminder_date?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  priority?: Priority;
  tags?: Tag[];
  attachments?: TaskAttachment[];
  collaborators?: User[];
}

export interface TaskAttachment {
  id: number;
  task_id: number;
  type: 'image' | 'document' | 'link';
  name: string;
  path?: string;
  url?: string;
  mime_type?: string;
  size?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority_id?: number;
  due_date?: string;
  reminder_date?: string;
  tags?: number[];
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  is_completed?: boolean;
}

export interface TaskStatistics {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
  due_today: number;
  completion_rate: number;
}