"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./entity/task.entity");
let TasksService = class TasksService {
    taskRepository;
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async findAll() {
        try {
            return await this.taskRepository.find({
                order: { createdAt: 'DESC' },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Erro ao buscar tarefas');
        }
    }
    async findOne(id) {
        if (!id) {
            throw new common_1.BadRequestException('ID inválido');
        }
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new common_1.NotFoundException(`Tarefa com ID ${id} não encontrada`);
        }
        return task;
    }
    async create(createTaskDto) {
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
        }
        catch (error) {
            throw new common_1.BadRequestException('Erro ao criar tarefa');
        }
    }
    async update(id, updateTaskDto) {
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
        }
        catch (error) {
            throw new common_1.BadRequestException('Erro ao atualizar tarefa');
        }
    }
    async remove(id) {
        const task = await this.findOne(id);
        try {
            await this.taskRepository.remove(task);
        }
        catch (error) {
            throw new common_1.BadRequestException('Erro ao remover tarefa');
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map