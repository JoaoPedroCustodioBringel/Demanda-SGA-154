import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entity/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) { }

  async findAll(): Promise<Task[]> {
    try {
      return await this.taskRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new BadRequestException('Erro ao buscar tarefas');
    }
  }

  async findOne(id: string): Promise<Task> {
    if (!id) {
      throw new BadRequestException('ID inválido');
    }

    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const dueDate = new Date(createTaskDto.dueDate);
      const adjustedDate = new Date(dueDate.getTime() + dueDate.getTimezoneOffset() * 60000);

      const task = this.taskRepository.create({
        title: createTaskDto.title,
        description: createTaskDto.description,
        dueDate: adjustedDate,
        completed: createTaskDto.completed ?? false,
        priority: createTaskDto.priority ?? 'medium',
      });

      const savedTask = await this.taskRepository.save(task);
      return savedTask;
    } catch (error) {
      throw new BadRequestException('Erro ao criar tarefa');
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }
    if (updateTaskDto.dueDate !== undefined) {
      const dueDate = new Date(updateTaskDto.dueDate);
      task.dueDate = new Date(dueDate.getTime() + dueDate.getTimezoneOffset() * 60000);
    }
    if (updateTaskDto.completed !== undefined) {
      task.completed = updateTaskDto.completed;
    }
    if (updateTaskDto.priority !== undefined) {
      task.priority = updateTaskDto.priority;
    }

    try {
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar tarefa');
    }
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    try {
      await this.taskRepository.remove(task);
    } catch (error) {
      throw new BadRequestException('Erro ao remover tarefa');
    }
  }
}