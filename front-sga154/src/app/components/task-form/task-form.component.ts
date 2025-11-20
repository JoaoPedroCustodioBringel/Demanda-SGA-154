import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../service/task.service';
import { Task } from '../../models/task.models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  taskForm!: FormGroup;
  isEditMode = false;
  taskId: string | null = null;
  task: Task | null = null;
  isLoading = signal(true);
  submitting = signal(false);

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;

    if (this.isEditMode && this.taskId) {
      this.loadTask(this.taskId);
    } else {
      this.initForm();
    }
  }

  loadTask(id: string): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task: Task) => {
        this.task = task;
        this.initForm();
      },
      error: () => {
        this.router.navigate(['/tasks']);
      }
    });
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: [this.task?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [this.task?.description || '', [Validators.required, Validators.minLength(5)]],
      dueDate: [this.formatDateForInput(this.task?.dueDate), Validators.required],
      completed: [this.task?.completed || false],
      priority: [this.task?.priority || 'medium', Validators.required]
    });
    this.isLoading.set(false);
  }

  formatDateForInput(date: string | Date | undefined): string {
    if (!date) return '';
    if (typeof date === 'string') return date.split('T')[0];
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formValue = this.taskForm.value;

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, formValue).subscribe({
        next: () => {
          this.submitting.set(false);
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.submitting.set(false);
        }
      });
    } else {
      this.taskService.createTask(formValue).subscribe({
        next: () => {
          this.submitting.set(false);
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.submitting.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo é obrigatório';
    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }
    return '';
  }
}