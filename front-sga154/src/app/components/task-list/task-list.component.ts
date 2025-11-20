import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../../service/task.service';
import { Task } from '../../models/task.models';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  taskService = inject(TaskService);
  router = inject(Router);
  processingTaskId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.loadTasks().subscribe();
  }

  onNewTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  onEditTask(task: Task): void {
    this.router.navigate(['/tasks/edit', task.id]);
  }

  onDeleteTask(task: Task): void {
    if (confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe();
    }
  }

  onToggleComplete(event: Event, task: Task): void {
    event.preventDefault();

    if (this.processingTaskId() === task.id) {
      return;
    }

    this.processingTaskId.set(task.id);

    this.taskService.toggleComplete(task).subscribe({
      next: () => {
        this.processingTaskId.set(null);
      },
      error: () => {
        this.processingTaskId.set(null);
      },
    });
  }

  getPriorityBadgeClass(priority: string): string {
    const classes: Record<string, string> = {
      low: 'bg-success',
      medium: 'bg-warning text-dark',
      high: 'bg-danger',
    };
    return classes[priority] || 'bg-secondary';
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
    };
    return labels[priority] || priority;
  }

  formatDate(date: string | Date): string {
    if (!date) {
      return 'Data não disponível';
    }
    try {
      const d = typeof date === 'string' ? new Date(date) : new Date(date);
      if (isNaN(d.getTime())) {
        return 'Data inválida';
      }
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return 'Erro na data';
    }
  }

  isProcessing(taskId: string): boolean {
    return this.processingTaskId() === taskId;
  }
}