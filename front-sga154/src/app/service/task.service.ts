import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tasks';

  tasks = signal<Task[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  loadTasks(): Observable<Task[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap({
        next: (tasks) => {
          this.tasks.set(tasks);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Erro ao carregar tarefas');
          this.loading.set(false);
        }
      })
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: CreateTaskDto): Observable<Task> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap({
        next: (newTask) => {
          this.tasks.update(tasks => [newTask, ...tasks]);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Erro ao criar tarefa');
          this.loading.set(false);
        }
      })
    );
  }

  updateTask(id: string, task: UpdateTaskDto): Observable<Task> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      tap({
        next: (updatedTask) => {
          this.tasks.update(tasks =>
            tasks.map(t => t.id === id ? { ...updatedTask } : t)
          );
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Erro ao atualizar tarefa');
          this.loading.set(false);
        }
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => {
          this.tasks.update(tasks => tasks.filter(t => t.id !== id));
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Erro ao deletar tarefa');
          this.loading.set(false);
        }
      })
    );
  }

  toggleComplete(task: Task): Observable<Task> {
    const updateData: UpdateTaskDto = {
      completed: !task.completed
    };
    return this.updateTask(task.id, updateData);
  }
}