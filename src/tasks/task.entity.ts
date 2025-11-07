export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority?: number;
  tags?: string[];
  ownerId: string;
}
